select
  consignmentitem.id,
  consignmentitem.consignmentId,
  consignmentitem.productId,
  consignmentitem.quantity,
  consignmentitem.price,
  consignmentitem.unitId,
  consignmentitem.currencyId,
  product.title as productTitle,
  product.barcode as productBarcode,
  category.title as categoryTitle,
  unit.title as unitTitle
from
  consignmentitem
  left join product on product.id = consignmentitem.productId
  left join unit on unit.id = consignmentitem.unitId
  left join category on category.id = product.categoryId
where
  consignmentitem.consignmentId = $consignmentId
