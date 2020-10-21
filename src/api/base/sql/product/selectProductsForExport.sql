select
  product.*,
  unit.notation as unitNotation,
  unit.title as unitTitle,
  category.title as categoryTitle
from
  product
  left join unit     on unit.id     = product.unitId
  left join category on category.id = product.categoryId
order by product.id asc
