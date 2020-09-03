select
  id,
  consignmentId,
  productId,
  unitId,
  currencyId,
  quantity,
  price
from
  consignmentitem
where
  id not in (select id from sync where entity = 'consignmentitem')
limit $limit
