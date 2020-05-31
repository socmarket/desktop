select
  consignmentitem.quantity       as quantity,
  consignmentitem.price / 100.00 as price,
  consignment.acceptedAt         as acceptedAt,
  product.title                  as productTitle,
  product.barcode                as productBarcode,
  category.title                 as categoryTitle,
  unit.title                     as unitTitle
from
  consignmentitem
  left join product on product.id = consignmentitem.productId
  left join unit on unit.id = consignmentitem.unitId
  left join category on category.id = product.categoryId
  left join consignment on consignment.id = consignmentitem.consignmentId
where
  consignmentitem.productId = $productId
order by
  consignment.acceptedAt desc
