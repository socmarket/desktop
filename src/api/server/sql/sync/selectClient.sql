select
  id,
  name,
  contacts,
  notes
from
  client
where
  id not in (select id from sync where entity = 'client')
limit $limit
