select
  consignmentItemId as id,
  consignmentItemId,
  quantity,
  notes,
  returnedAt
from
  consignmentreturn
where
  consignmentItemId not in (select id from sync where entity = 'consignmentret')
limit $limit
