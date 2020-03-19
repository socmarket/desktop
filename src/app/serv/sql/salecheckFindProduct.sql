select
  product.id      as productId,
  product.barcode as barcode,
  product.code    as code,
  product.title   as title,
  product.notes   as notes,
  (select max(price) 
from product
  left join (select maxprice where price.productId = product.id
