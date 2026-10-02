create type public.product_status as enum ('active', 'draft', 'coming_soon');

alter table public.products
  add column status public.product_status not null default 'active',
  add column stock integer not null default 0 check (stock >= 0);

update public.products
   set status = case when is_active then 'active' else 'draft' end::public.product_status;

drop policy "Anyone can view active products" on public.products;
drop index public.products_type_idx;
alter table public.products drop column is_active;

create index products_type_idx on public.products (type) where status <> 'draft';

create policy "Anyone can view published products"
  on public.products for select
  to anon, authenticated
  using (status <> 'draft' or public.is_admin());

create or replace function public.place_order()
returns public.orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id text := public.requesting_user_id();
  v_short record;
  v_subtotal numeric(10, 2);
  v_discount numeric(10, 2);
  v_delivery numeric(10, 2);
  v_order public.orders;
begin
  if v_user_id is null then
    raise exception 'You must be signed in to place an order'
      using errcode = '28000';
  end if;

  perform 1
     from public.products p
    where p.id in (select product_id from public.cart_items where user_id = v_user_id)
      for update;

  select p.name, p.stock
    into v_short
    from (select product_id, sum(quantity) as quantity
            from public.cart_items
           where user_id = v_user_id
           group by product_id) c
    join public.products p on p.id = c.product_id and p.status = 'active'
   where c.quantity > p.stock
   limit 1;

  if found then
    raise exception '%',
      case when v_short.stock = 0
        then format('%s is sold out', v_short.name)
        else format('Only %s of %s left in stock', v_short.stock, v_short.name)
      end
      using errcode = 'P0001';
  end if;

  select coalesce(sum(p.price * c.quantity), 0)
    into v_subtotal
    from public.cart_items c
    join public.products p on p.id = c.product_id and p.status = 'active'
   where c.user_id = v_user_id;

  if v_subtotal = 0 then
    raise exception 'Your cart is empty' using errcode = 'P0001';
  end if;

  v_discount := case when v_subtotal >= 60 then 9 else 0 end;
  v_delivery := case when v_subtotal >= 50 then 0 else 6 end;

  insert into public.orders (user_id, subtotal, discount, delivery, total)
  values (v_user_id, v_subtotal, v_discount, v_delivery,
          v_subtotal - v_discount + v_delivery)
  returning * into v_order;

  insert into public.order_items
    (order_id, product_id, name, image, price, quantity, size, pot_style)
  select v_order.id, p.id, p.name, p.images[1], p.price, c.quantity,
         c.size, c.pot_style
    from public.cart_items c
    join public.products p on p.id = c.product_id and p.status = 'active'
   where c.user_id = v_user_id
   order by c.created_at;

  update public.products p
     set stock = p.stock - c.quantity
    from (select product_id, sum(quantity) as quantity
            from public.cart_items
           where user_id = v_user_id
           group by product_id) c
   where p.id = c.product_id and p.status = 'active';

  delete from public.cart_items where user_id = v_user_id;

  return v_order;
end;
$$;

create or replace function public.buy_now(
  p_product_id bigint,
  p_quantity integer default 1,
  p_size text default null,
  p_pot_style text default null
)
returns public.orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id text := public.requesting_user_id();
  v_product public.products;
  v_size text;
  v_pot_style text;
  v_subtotal numeric(10, 2);
  v_discount numeric(10, 2);
  v_delivery numeric(10, 2);
  v_order public.orders;
begin
  if v_user_id is null then
    raise exception 'You must be signed in to place an order'
      using errcode = '28000';
  end if;

  if p_quantity is null or p_quantity not between 1 and 99 then
    raise exception 'Quantity must be between 1 and 99' using errcode = '22023';
  end if;

  select * into v_product
    from public.products
   where id = p_product_id and status = 'active'
     for update;

  if not found then
    raise exception 'This product is no longer available' using errcode = 'P0002';
  end if;

  if v_product.stock < p_quantity then
    raise exception '%',
      case when v_product.stock = 0
        then format('%s is sold out', v_product.name)
        else format('Only %s of %s left in stock', v_product.stock, v_product.name)
      end
      using errcode = 'P0001';
  end if;

  if v_product.type = 'plant' then
    v_size := coalesce(p_size, 'Medium');
    v_pot_style := coalesce(p_pot_style, 'Ivory');

    if v_size not in ('Small', 'Medium', 'Large')
       or v_pot_style not in ('Ivory', 'Sand', 'Charcoal') then
      raise exception 'Please choose a valid size and pot style' using errcode = '22023';
    end if;
  end if;

  v_subtotal := v_product.price * p_quantity;
  v_discount := case when v_subtotal >= 60 then 9 else 0 end;
  v_delivery := case when v_subtotal >= 50 then 0 else 6 end;

  insert into public.orders (user_id, subtotal, discount, delivery, total)
  values (v_user_id, v_subtotal, v_discount, v_delivery,
          v_subtotal - v_discount + v_delivery)
  returning * into v_order;

  insert into public.order_items
    (order_id, product_id, name, image, price, quantity, size, pot_style)
  values (v_order.id, v_product.id, v_product.name, v_product.images[1],
          v_product.price, p_quantity, v_size, v_pot_style);

  update public.products
     set stock = stock - p_quantity
   where id = v_product.id;

  return v_order;
end;
$$;

create function public.restock_cancelled_order()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_direction integer;
begin
  if new.status = 'cancelled' and old.status <> 'cancelled' then
    v_direction := 1;
  elsif old.status = 'cancelled' and new.status <> 'cancelled' then
    v_direction := -1;
  else
    return new;
  end if;

  update public.products p
     set stock = greatest(p.stock + v_direction * i.quantity, 0)
    from (select product_id, sum(quantity) as quantity
            from public.order_items
           where order_id = new.id and product_id is not null
           group by product_id) i
   where p.id = i.product_id;

  return new;
end;
$$;

revoke execute on function public.restock_cancelled_order() from public, anon, authenticated;

create trigger orders_restock_on_cancel
  after update of status on public.orders
  for each row execute function public.restock_cancelled_order();
