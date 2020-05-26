select
  consignment.id,
  supplier.name as supplierName,
  consignment.acceptedAt as acceptedAt,
  total.cost as cost
from
  consignment
  left join supplier on supplier.id = consignment.supplierId
  left join (
    select
      consignmentId,
      sum(quantity * price / 100.00) as cost
    from
      consignmentitem
    group by
      consignmentId
  ) total on total.consignmentId = consignment.id
order by
  consignment.acceptedAt desc
