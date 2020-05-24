select
  consignment.id,
  supplier.name as supplierName,
  consignment.acceptedAt as acceptedAt
from
  consignment
  left join supplier on supplier.id = consignment.supplierId
order by
  consignment.acceptedAt desc
