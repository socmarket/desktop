select
  id,
  title,
  notation
from
  unit
where
  id not in (select id from sync where entity = 'unit')
limit $limit
