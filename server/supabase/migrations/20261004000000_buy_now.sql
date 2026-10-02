create function public.buy_now(
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
   where id = p_product_id and is_active;

  if not found then
    raise exception 'This product is no longer available' using errcode = 'P0002';
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

  return v_order;
end;
$$;

revoke execute on function public.buy_now(bigint, integer, text, text) from public, anon;
grant execute on function public.buy_now(bigint, integer, text, text) to authenticated;
