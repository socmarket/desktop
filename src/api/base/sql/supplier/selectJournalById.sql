select
  registeredAt,
  round(amount) as amount,
  kind
from (
  select
    registeredAt    as registeredAt,
    amount / 100.0 as amount,
    'moneyOut'      as kind
  from
    supplierbalance
  where
    amount < 0 and supplierbalance.supplierId = $supplierId

  union all

  select
    registeredAt   as registeredAt,
    amount / 100.0 as amount,
    'moneyIn'      as kind
  from
    supplierbalance
  where
    amount > 0 and supplierbalance.supplierId = $supplierId

  union all

  select
    acceptedAt    as registeredAt,
    -cost         as amount,
    'consignment' as kind
  from (
    select
      acceptedAt  as acceptedAt,
      sum((consignmentitem.quantity - coalesce(ret.quantity, 0)) * price) / 10000.0 as cost
    from consignmentitem
    left join consignment           on consignment.id = consignmentitem.consignmentId
    left join consignmentreturn ret on ret.consignmentItemId = consignmentitem.id
    where consignment.supplierId = $supplierId
    group by consignment.id
  ) t
) t
order by registeredAt desc
