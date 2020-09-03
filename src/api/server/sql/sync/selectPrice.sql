select
  id,
  productId,
  price,
  currencyId,
  setAt
from
  price
where
  id not in (select id from sync where entity = 'price')
limit $limit
