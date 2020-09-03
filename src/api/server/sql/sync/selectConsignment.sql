select
  id,
  supplierId,
  closed,
  acceptedAt
from
  consignment
where
  id not in (select id from sync where entity = 'consignment')
limit $limit
