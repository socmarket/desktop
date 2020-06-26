select
  client.id,
  client.name
from
  client
where
  client.name like '%' || $pattern || '%'
order by
  client.name asc
