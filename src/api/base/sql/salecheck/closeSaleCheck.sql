insert into salecheckitem(
  saleCheckId,
  productId,
  quantity,
  price,
  originalPrice,
  unitId,
  currencyId
) select 
  $currentSaleCheckId,
  productId,
  quantity,
  price,
  originalPrice,
  unitId,
  currencyId
from currentsalecheck
where
  saleCheckId = $saleCheckId
