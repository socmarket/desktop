select
  product.*,
  category.title as categoryTitle
from
  product
  left join category on category.id = product.categoryId
where (product.titleLower like ?) or (product.code like ?) or (product.barcode like ?)
limit 20
