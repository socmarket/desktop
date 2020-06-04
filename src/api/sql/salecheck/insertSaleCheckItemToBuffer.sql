insert into salecheckitembuffer(
  saleCheckId,
  productId,
  quantity,
  price,
  discount,
  unitId,
  currencyId
) values(
  $saleCheckId,
  $productId,
  $quantity,
  $price,
  $discount,
  $unitId,
  $currencyId
)
