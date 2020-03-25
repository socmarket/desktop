select
  consignment.acceptedAt,
  supplier.name as supplierName,
  (select sum(price / 100.00 * quantity) from consignmentitem where consignmentId = consignment.id) as total
from consignment
left join supplier on supplier.id = consignment.supplierId
order by consignment.acceptedAt desc
limit 5
