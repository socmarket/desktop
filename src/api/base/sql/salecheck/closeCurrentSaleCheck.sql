insert into salecheckitem(
  saleCheckId,
  productId,
  quantity,
  price,
  originalPrice,
  unitId,
  currencyId
) select 
  $saleCheckId,
  productId,
  quantity,
  price,
  originalPrice,
  unitId,
  currencyId
from currentsalecheck
