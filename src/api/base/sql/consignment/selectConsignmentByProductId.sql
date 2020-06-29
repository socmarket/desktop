select
  acceptedAt              as acceptedAt,
  round(quantity / 100.0) as quantity,
  round(price / 100.0)    as price,
  currency.notation       as currencyNotation,
  supplier.name           as supplierName
from
  consignmentitem
  left join currency    on currency.id    = consignmentitem.currencyId
  left join consignment on consignment.id = consignmentitem.consignmentId
  left join supplier    on supplier.id    = consignment.supplierId
where
  consignmentitem.productId = $productId
order by
  acceptedAt desc
