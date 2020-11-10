select
  consignment.id                             as id,
  consignment.supplierId                     as supplierId,
  consignment.acceptedAt                     as acceptedAt,
  date(consignment.acceptedAt, 'localtime')  as acceptedAtDate,
  time(consignment.acceptedAt, 'localtime')  as acceptedAtTime
from
  consignment
where
  id = $id
