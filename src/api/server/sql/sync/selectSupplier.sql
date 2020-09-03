select
  id,
  name,
  contacts,
  notes
from
  supplier
where
  id not in (select id from sync where entity = 'supplier')
limit $limit
