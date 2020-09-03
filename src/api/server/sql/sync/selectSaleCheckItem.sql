select
  id,
  saleCheckId,
  productId,
  unitId,
  currencyId,
  quantity,
  originalPrice,
  price,
  discount
from
  salecheckitem
where
  id not in (select id from sync where entity = 'salecheckitem')
limit $limit
