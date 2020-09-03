select
  saleCheckItemId as id,
  saleCheckItemId,
  quantity,
  notes,
  returnedAt
from
  salecheckreturn
where
  saleCheckItemId not in (select id from sync where entity = 'salecheckret')
limit $limit
