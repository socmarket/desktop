insert into consignmentprice(
  productId,
  price,
  currencyId
) values(
  $productId,
  round($price * 100),
  $currencyId
) on conflict(productId) do update set price = round($price * 100), updatedAt = current_timestamp
