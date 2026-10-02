alter table public.orders
  add column shipped_at timestamptz,
  add column delivered_at timestamptz,
  add column cancelled_at timestamptz,
  add column cancel_reason text check (char_length(cancel_reason) <= 500);

create function public.stamp_order_status()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = old.status then
    return new;
  end if;

  case new.status
    when 'processing' then
      new.shipped_at := null;
      new.delivered_at := null;
      new.cancelled_at := null;
      new.cancel_reason := null;
    when 'shipped' then
      new.shipped_at := coalesce(old.shipped_at, now());
      new.delivered_at := null;
      new.cancelled_at := null;
      new.cancel_reason := null;
    when 'delivered' then
      new.shipped_at := coalesce(old.shipped_at, now());
      new.delivered_at := now();
      new.cancelled_at := null;
      new.cancel_reason := null;
    when 'cancelled' then
      new.cancelled_at := now();
  end case;

  return new;
end;
$$;

revoke execute on function public.stamp_order_status() from public, anon, authenticated;

create trigger orders_stamp_status
  before update of status on public.orders
  for each row execute function public.stamp_order_status();

create function public.cancel_order(p_order_number text, p_reason text default null)
returns public.orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id text := public.requesting_user_id();
  v_order public.orders;
begin
  if v_user_id is null then
    raise exception 'You must be signed in to cancel an order'
      using errcode = '28000';
  end if;

  select * into v_order
    from public.orders
   where order_number = p_order_number
     and (user_id = v_user_id or public.is_admin())
     for update;

  if not found then
    raise exception 'Order not found' using errcode = 'P0002';
  end if;

  if v_order.status <> 'processing' then
    raise exception 'Only orders that haven''t shipped yet can be cancelled'
      using errcode = 'P0001';
  end if;

  update public.orders
     set status = 'cancelled',
         cancel_reason = nullif(left(btrim(p_reason), 500), '')
   where id = v_order.id
  returning * into v_order;

  return v_order;
end;
$$;

revoke execute on function public.cancel_order(text, text) from public, anon;
grant execute on function public.cancel_order(text, text) to authenticated;
