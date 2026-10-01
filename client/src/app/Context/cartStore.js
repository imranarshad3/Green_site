// Cart lines are stored as { productId, size, potStyle, quantity }, both in
// localStorage (guests) and in the cart_items table (signed-in users).
// size/potStyle are null for fertilizers.

export const MAX_LINE_QUANTITY = 99;

export const sameLine = (a, b) =>
  a.productId === b.productId &&
  (a.size ?? null) === (b.size ?? null) &&
  (a.potStyle ?? null) === (b.potStyle ?? null);

// Returns lines with `line` set to `quantity` (removed when <= 0).
export function withLineQuantity(lines, line, quantity) {
  const capped = Math.min(quantity, MAX_LINE_QUANTITY);
  const exists = lines.some((item) => sameLine(item, line));

  if (capped <= 0) {
    return lines.filter((item) => !sameLine(item, line));
  }

  if (exists) {
    return lines.map((item) =>
      sameLine(item, line) ? { ...item, quantity: capped } : item
    );
  }

  return [...lines, { ...line, quantity: capped }];
}

export const fromRow = (row) => ({
  productId: row.product_id,
  size: row.size,
  potStyle: row.pot_style,
  quantity: row.quantity,
});

const matchLine = (query, line) => {
  let matched = query.eq("product_id", line.productId);
  matched = line.size ? matched.eq("size", line.size) : matched.is("size", null);
  matched = line.potStyle
    ? matched.eq("pot_style", line.potStyle)
    : matched.is("pot_style", null);
  return matched;
};

// Makes the database row for `line` hold `quantity` (deleting it at 0).
// Row-level security scopes every query to the signed-in user.
export async function persistLineQuantity(supabase, line, quantity) {
  const table = () => supabase.from("cart_items");

  if (quantity <= 0) {
    const { error } = await matchLine(table().delete(), line);
    if (error) throw error;
    return;
  }

  const { data, error } = await matchLine(
    table().update({ quantity }),
    line
  ).select("id");
  if (error) throw error;

  if (data.length === 0) {
    const { error: insertError } = await table().insert({
      product_id: line.productId,
      size: line.size ?? null,
      pot_style: line.potStyle ?? null,
      quantity,
    });
    if (insertError) throw insertError;
  }
}
