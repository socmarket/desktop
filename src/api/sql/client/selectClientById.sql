select
  client.id,
  client.name
from
  client
where
  client.id = $clientId
