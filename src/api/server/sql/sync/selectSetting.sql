select
  id,
  key,
  value
from
  settings
where
  id not in (select id from sync where entity = 'setting')
limit $limit
