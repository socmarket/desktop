select
  client.id,
  client.name
from
  client
where
  client.nameLower like '%' || $pattern || '%'
order by
  client.nameLower asc
