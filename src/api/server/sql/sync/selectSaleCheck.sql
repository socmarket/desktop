select
  id,
  clientId,
  cash,
  change,
  discount,
  closed,
  soldAt
from
  salecheck
where
  id not in (select id from sync where entity = 'salecheck')
limit $limit
