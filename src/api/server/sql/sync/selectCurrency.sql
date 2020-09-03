select
  id,
  title,
  notation
from
  currency
where
  id not in (select id from sync where entity = 'currency')
limit $limit
