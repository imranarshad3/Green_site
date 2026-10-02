alter table public.orders
  add column shipping_name text check (char_length(shipping_name) <= 120),
  add column shipping_email text check (char_length(shipping_email) <= 254),
  add column shipping_phone text check (char_length(shipping_phone) <= 40),
  add column shipping_address text check (char_length(shipping_address) <= 300),
  add column shipping_city text check (char_length(shipping_city) <= 120),
  add column shipping_postal_code text check (char_length(shipping_postal_code) <= 20),
  add column promo_code text,
  add column promo_discount numeric(10, 2) not null default 0,
  add column courier text check (char_length(courier) <= 80),
  add column tracking_number text check (char_length(tracking_number) <= 80);

revoke update on public.orders from authenticated;
grant update (status, courier, tracking_number) on public.orders to authenticated;

create type public.promo_kind as enum ('percent', 'fixed');

create table public.promo_codes (
  code text primary key check (code ~ '^[A-Z0-9_-]{3,20}$'),
  kind public.promo_kind not null,
  amount numeric(10, 2) not null check (amount > 0),
  min_subtotal numeric(10, 2) not null default 0 check (min_subtotal >= 0),
  max_uses integer check (max_uses > 0),
  uses integer not null default 0 check (uses >= 0),
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  check (kind <> 'percent' or amount <= 100)
);

alter table public.promo_codes enable row level security;

create policy "Admins manage promo codes"
  on public.promo_codes for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create function public.promo_discount(p_code text, p_subtotal numeric)
returns numeric
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_promo public.promo_codes;
  v_discount numeric(10, 2);
begin
  if p_code is null or btrim(p_code) = '' then
    return 0;
  end if;

  select * into v_promo
    from public.promo_codes
   where code = upper(btrim(p_code));

  if not found or not v_promo.active then
    raise exception 'This promo code isn''t valid' using errcode = 'P0001';
  end if;

  if v_promo.expires_at is not null and v_promo.expires_at < now() then
    raise exception 'This promo code has expired' using errcode = 'P0001';
  end if;

  if v_promo.max_uses is not null and v_promo.uses >= v_promo.max_uses then
    raise exception 'This promo code has been fully used' using errcode = 'P0001';
  end if;

  if p_subtotal < v_promo.min_subtotal then
    raise exception 'Spend at least $% to use this code', v_promo.min_subtotal
      using errcode = 'P0001';
  end if;

  v_discount := case v_promo.kind
    when 'percent' then round(p_subtotal * v_promo.amount / 100, 2)
    else v_promo.amount
  end;

  return least(v_discount, p_subtotal);
end;
$$;

revoke execute on function public.promo_discount(text, numeric) from public, anon, authenticated;

create function public.check_promo(p_code text, p_subtotal numeric)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_promo public.promo_codes;
begin
  perform public.promo_discount(p_code, p_subtotal);

  select * into v_promo
    from public.promo_codes
   where code = upper(btrim(p_code));

  if not found then
    raise exception 'This promo code isn''t valid' using errcode = 'P0001';
  end if;

  return jsonb_build_object(
    'code', v_promo.code,
    'kind', v_promo.kind,
    'amount', v_promo.amount,
    'min_subtotal', v_promo.min_subtotal
  );
end;
$$;

revoke execute on function public.check_promo(text, numeric) from public;
grant execute on function public.check_promo(text, numeric) to anon, authenticated;

create function public.clean_shipping(p_shipping jsonb)
returns jsonb
language plpgsql
immutable
set search_path = ''
as $$
declare
  v jsonb;
begin
  v := jsonb_build_object(
    'name', nullif(btrim(p_shipping ->> 'name'), ''),
    'email', nullif(lower(btrim(p_shipping ->> 'email')), ''),
    'phone', nullif(btrim(p_shipping ->> 'phone'), ''),
    'address', nullif(btrim(p_shipping ->> 'address'), ''),
    'city', nullif(btrim(p_shipping ->> 'city'), ''),
    'postal_code', nullif(btrim(p_shipping ->> 'postal_code'), '')
  );

  if v ->> 'name' is null or v ->> 'email' is null or v ->> 'phone' is null
     or v ->> 'address' is null or v ->> 'city' is null then
    raise exception 'Please fill in your name, email, phone, address and city'
      using errcode = '22023';
  end if;

  if v ->> 'email' !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'Please enter a valid email address' using errcode = '22023';
  end if;

  if v ->> 'phone' !~ '^[0-9+()\s-]{7,20}$' then
    raise exception 'Please enter a valid phone number' using errcode = '22023';
  end if;

  return v;
end;
$$;

revoke execute on function public.clean_shipping(jsonb) from public, anon, authenticated;

create function public.create_order(
  p_user_id text,
  p_subtotal numeric,
  p_shipping jsonb,
  p_promo_code text
)
returns public.orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_shipping jsonb := public.clean_shipping(p_shipping);
  v_code text := nullif(upper(btrim(p_promo_code)), '');
  v_promo numeric(10, 2) := 0;
  v_discount numeric(10, 2);
  v_delivery numeric(10, 2);
  v_order public.orders;
begin
  if v_code is not null then
    perform 1 from public.promo_codes where code = v_code for update;
    v_promo := public.promo_discount(v_code, p_subtotal);
    update public.promo_codes set uses = uses + 1 where code = v_code;
  end if;

  v_discount := least(
    (case when p_subtotal >= 60 then 9 else 0 end) + v_promo,
    p_subtotal
  );
  v_delivery := case when p_subtotal >= 50 then 0 else 6 end;

  insert into public.orders (
    user_id, subtotal, discount, delivery, total,
    promo_code, promo_discount,
    shipping_name, shipping_email, shipping_phone,
    shipping_address, shipping_city, shipping_postal_code
  )
  values (
    p_user_id, p_subtotal, v_discount, v_delivery,
    p_subtotal - v_discount + v_delivery,
    v_code, v_promo,
    v_shipping ->> 'name', v_shipping ->> 'email', v_shipping ->> 'phone',
    v_shipping ->> 'address', v_shipping ->> 'city', v_shipping ->> 'postal_code'
  )
  returning * into v_order;

  return v_order;
end;
$$;

revoke execute on function public.create_order(text, numeric, jsonb, text) from public, anon, authenticated;

drop function public.place_order();

create function public.place_order(p_shipping jsonb, p_promo_code text default null)
returns public.orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id text := public.requesting_user_id();
  v_short record;
  v_subtotal numeric(10, 2);
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

  v_order := public.create_order(v_user_id, v_subtotal, p_shipping, p_promo_code);

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

revoke execute on function public.place_order(jsonb, text) from public, anon;
grant execute on function public.place_order(jsonb, text) to authenticated;

drop function public.buy_now(bigint, integer, text, text);

create function public.buy_now(
  p_product_id bigint,
  p_quantity integer,
  p_size text,
  p_pot_style text,
  p_shipping jsonb,
  p_promo_code text default null
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

  v_order := public.create_order(
    v_user_id, v_product.price * p_quantity, p_shipping, p_promo_code
  );

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

revoke execute on function public.buy_now(bigint, integer, text, text, jsonb, text) from public, anon;
grant execute on function public.buy_now(bigint, integer, text, text, jsonb, text) to authenticated;

create table public.product_reviews (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products (id) on delete cascade,
  user_id text not null default public.requesting_user_id(),
  author_name text not null check (char_length(author_name) between 1 and 80),
  rating smallint not null check (rating between 1 and 5),
  title text check (char_length(title) <= 120),
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  unique (product_id, user_id)
);

create index product_reviews_product_idx
  on public.product_reviews (product_id, created_at desc);

create function public.has_received_product(p_product_id bigint)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
      from public.orders o
      join public.order_items i on i.order_id = o.id
     where o.user_id = public.requesting_user_id()
       and o.status = 'delivered'
       and i.product_id = p_product_id
  );
$$;

revoke execute on function public.has_received_product(bigint) from public, anon;
grant execute on function public.has_received_product(bigint) to authenticated;

alter table public.product_reviews enable row level security;

create policy "Anyone can read reviews"
  on public.product_reviews for select
  to anon, authenticated
  using (true);

create policy "Customers review products they received"
  on public.product_reviews for insert
  to authenticated
  with check (
    user_id = public.requesting_user_id()
    and public.has_received_product(product_id)
  );

create policy "Customers edit their own reviews"
  on public.product_reviews for update
  to authenticated
  using (user_id = public.requesting_user_id())
  with check (user_id = public.requesting_user_id());

create policy "Customers and admins delete reviews"
  on public.product_reviews for delete
  to authenticated
  using (user_id = public.requesting_user_id() or public.is_admin());

revoke update on public.product_reviews from authenticated;
grant update (author_name, rating, title, body, updated_at)
  on public.product_reviews to authenticated;

create function public.refresh_product_rating()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_product_id bigint := coalesce(new.product_id, old.product_id);
begin
  update public.products p
     set rating = s.rating,
         reviews = s.reviews
    from (select round(avg(rating), 1) as rating, count(*) as reviews
            from public.product_reviews
           where product_id = v_product_id) s
   where p.id = v_product_id;

  return null;
end;
$$;

revoke execute on function public.refresh_product_rating() from public, anon, authenticated;

create trigger product_reviews_refresh_rating
  after insert or update of rating or delete on public.product_reviews
  for each row execute function public.refresh_product_rating();

create type public.return_status as enum ('requested', 'approved', 'rejected');

create table public.return_requests (
  id bigint generated always as identity primary key,
  order_id bigint not null unique references public.orders (id) on delete cascade,
  user_id text not null,
  reason text not null check (char_length(reason) between 1 and 120),
  details text check (char_length(details) <= 2000),
  status public.return_status not null default 'requested',
  admin_note text check (char_length(admin_note) <= 1000),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index return_requests_status_idx on public.return_requests (status);

alter table public.return_requests enable row level security;

create policy "Customers see their own returns; admins see all"
  on public.return_requests for select
  to authenticated
  using (user_id = public.requesting_user_id() or public.is_admin());

create policy "Admins resolve returns"
  on public.return_requests for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

revoke update on public.return_requests from authenticated;
grant update (status, admin_note) on public.return_requests to authenticated;

create function public.stamp_return_resolution()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status is distinct from old.status then
    new.resolved_at := case when new.status = 'requested' then null else now() end;
  end if;

  return new;
end;
$$;

revoke execute on function public.stamp_return_resolution() from public, anon, authenticated;

create trigger return_requests_stamp_resolution
  before update of status on public.return_requests
  for each row execute function public.stamp_return_resolution();

create function public.request_return(
  p_order_number text,
  p_reason text,
  p_details text default null
)
returns public.return_requests
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id text := public.requesting_user_id();
  v_order public.orders;
  v_request public.return_requests;
begin
  if v_user_id is null then
    raise exception 'You must be signed in to request a return'
      using errcode = '28000';
  end if;

  select * into v_order
    from public.orders
   where order_number = p_order_number and user_id = v_user_id;

  if not found then
    raise exception 'Order not found' using errcode = 'P0002';
  end if;

  if v_order.status <> 'delivered' then
    raise exception 'Only delivered orders can be returned' using errcode = 'P0001';
  end if;

  if coalesce(v_order.delivered_at, v_order.created_at) + interval '14 days' < now() then
    raise exception 'The 14-day return window for this order has closed'
      using errcode = 'P0001';
  end if;

  if exists (select 1 from public.return_requests where order_id = v_order.id) then
    raise exception 'A return has already been requested for this order'
      using errcode = 'P0001';
  end if;

  if p_reason is null or btrim(p_reason) = '' then
    raise exception 'Please choose a reason for the return' using errcode = '22023';
  end if;

  insert into public.return_requests (order_id, user_id, reason, details)
  values (v_order.id, v_user_id, left(btrim(p_reason), 120),
          nullif(left(btrim(p_details), 2000), ''))
  returning * into v_request;

  return v_request;
end;
$$;

revoke execute on function public.request_return(text, text, text) from public, anon;
grant execute on function public.request_return(text, text, text) to authenticated;

create table public.stock_alerts (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products (id) on delete cascade,
  user_id text not null default public.requesting_user_id(),
  email text check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  created_at timestamptz not null default now(),
  unique (product_id, user_id)
);

alter table public.stock_alerts enable row level security;

create policy "Customers see their own alerts; admins see all"
  on public.stock_alerts for select
  to authenticated
  using (user_id = public.requesting_user_id() or public.is_admin());

create policy "Customers sign up for alerts"
  on public.stock_alerts for insert
  to authenticated
  with check (user_id = public.requesting_user_id());

create policy "Customers and admins remove alerts"
  on public.stock_alerts for delete
  to authenticated
  using (user_id = public.requesting_user_id() or public.is_admin());
