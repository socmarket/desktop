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
  unit.notation     as unitNotation,

  coalesce(unit.title, '')     as unitTitle,
  coalesce(category.title, '') as categoryTitle
from
  product
  left join unit on (unit.id = product.unitId)
  left join category on (category.id = product.categoryId)
where
  product.id = $productId
