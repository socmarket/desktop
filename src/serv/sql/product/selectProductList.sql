select
  product.*,
  category.title as categoryTitle
from
  product
  left join category on category.id = product.categoryId
where
  (product.barcode = $pattern)
  or (product.titleLower like '%' || $pattern || '%')
  or (category.titleLower like '%' || $pattern || '%')
  or (category.titleLower like $key0 and product.titleLower like $key1)
limit 30
