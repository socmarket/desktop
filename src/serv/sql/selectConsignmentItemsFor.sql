select
  consignmentitem.id,
  consignmentitem.consignmentId,
  consignmentitem.productId,
  consignmentitem.quantity,
  consignmentitem.price,
  consignmentitem.unitId,
  consignmentitem.currencyId,
  product.title as productTitle,
  unit.title as unitTitle
from
  consignmentitem
  left join product on product.id = consignmentitem.productId
  left join unit on unit.id = consignmentitem.unitId
where
  consignmentitem.consignmentId = $consignmentId
