select
  consignment.acceptedAt,
  (select sum(price / 100.00 * quantity) from consignmentitem where consignmentId = consignment.id) as total
from consignment
order by consignment.acceptedAt desc
limit 5
