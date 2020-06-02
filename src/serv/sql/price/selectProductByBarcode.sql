select
  product.*,
  coalesce(category.title, '') as categoryTitle
from
  product
  left join category on category.id = product.categoryId
where
  product.barcode = $barcode
