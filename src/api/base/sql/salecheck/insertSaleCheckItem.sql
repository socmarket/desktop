insert into currentsalecheck(
  productId,
  quantity,
  price,
  originalPrice,
  unitId,
  currencyId,
  saleCheckId
) values (
  $productId,
  round($quantity * 100),
  round($price * 100),
  round($price * 100),
  $unitId,
  $currencyId,
  $saleCheckId
)
on conflict(productId, saleCheckId) do update set quantity = excluded.quantity + currentsalecheck.quantity
