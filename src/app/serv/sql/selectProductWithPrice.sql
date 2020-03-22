select
  product.id        as id,
  product.barcode   as barcode,
  product.title     as title,

  coalesce((select
    round(price / 100.00, 2)
   from price
   where productId = product.id
   order by setAt desc
   limit 1
  ), 0)             as price
from
  product
where
  product.barcode = ?
