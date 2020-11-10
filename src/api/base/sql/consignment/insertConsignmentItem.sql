insert into currentconsignment(
  productId,
  quantity,
  price,
  unitId,
  currencyId,
  consignmentId
) values (
  $productId,
  round($quantity * 100),
  round($price * 100),
  $unitId,
  $currencyId,
  $consignmentId
)
on conflict(productId, consignmentId) do update set quantity = excluded.quantity + currentconsignment.quantity
