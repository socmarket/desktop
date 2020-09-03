select
  id,
  parentId,
  title,
  notes
from
  category
where
  id not in (select id from sync where entity = 'category')
limit $limit
