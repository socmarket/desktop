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
  ), 0)             as price,

  unit.id           as unitId,
  unit.title        as unitTitle,
  unit.notation     as unitNotation
from
  product
  left join unit on (unit.id = product.unitId)
where
  product.barcode = ?
