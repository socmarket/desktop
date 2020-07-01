insert into currentconsignment(
  productId,
  quantity,
  price,
  unitId,
  currencyId
) values (
  $productId,
  round($quantity * 100),
  round($price * 100),
  $unitId,
  $currencyId
)
on conflict(productId) do update set quantity = excluded.quantity + currentconsignment.quantity
