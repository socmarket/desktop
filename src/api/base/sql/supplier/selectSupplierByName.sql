select
  id,
  name,
  contacts,
  notes,
  round(coalesce(balance, 0) - coalesce(cost, 0)) as balance
from (
  select
    supplier.id                 as id,
    supplier.name               as name,
    supplier.contacts           as contacts,
    supplier.notes              as notes,
    (
      select
        coalesce(sum(amount / 100.0), 0)
      from
        supplierbalance
      where
        supplierbalance.supplierId = supplier.id
    )                         as balance,

    (
      select
        sum((consignmentitem.quantity - coalesce(ret.quantity, 0)) * price) / 10000.0 as cost
      from consignmentitem
      left join consignment           on consignment.id = consignmentitem.consignmentId
      left join consignmentreturn ret on ret.consignmentItemId = consignmentitem.id
      where consignment.supplierId = supplier.id
    )                         as cost
  from
    supplier
  where
    supplier.nameLower like '%' || $pattern || '%'
  order by
    supplier.name asc
) t

