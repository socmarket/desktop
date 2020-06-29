select
  consignment.id               as id,
  supplier.name                as supplierName,
  consignment.acceptedAt       as acceptedAt,
  date(consignment.acceptedAt) as acceptedAtDate,
  (
    select sum ((consignmentitem.quantity - coalesce(ret.quantity, 0)) * price) / 10000.0 as cost
    from consignmentitem
    left join (
      select consignmentItemId, sum(quantity) as quantity
      from consignmentreturn
      group by consignmentItemId
    ) as ret on ret.consignmentItemId = consignmentitem.id
    where consignmentitem.consignmentId = consignment.id
  )                            as cost
from
  consignment
  left join supplier on supplier.id = consignment.supplierId
order by
  consignment.acceptedAt desc
