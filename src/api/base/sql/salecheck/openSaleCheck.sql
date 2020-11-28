insert into currentsalecheck(
  saleCheckId,
  productId,
  quantity,
  price,
  originalPrice,
  unitId,
  currencyId
) select 
  saleCheckId,
  productId,
  quantity,
  price,
  originalPrice,
  unitId,
  currencyId
from salecheckitem
where
  saleCheckId = $saleCheckId
order by
  salecheckitem.id asc
