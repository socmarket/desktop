select
  *,
  inQuantity - outQuantity as quantity
from
  (
    select
      product.*,
      category.title as categoryTitle,
      (select coalesce(sum(quantity), 0) from consignmentitem where productId = product.id) as inQuantity,
      (select coalesce(sum(quantity), 0) from salecheckitem where productId = product.id) as outQuantity
    from
      product
      left join category on category.id = product.categoryId
    where
      (product.barcode = $pattern)
      or (product.titleLower like '%' || $key0 || '%' || $key1 || '%' || $key2 || '%' || $key3 || '%' || $key4 || '%')
      or ((category.titleLower like '%' || $key0 || '%' || $key1 || '%') and (product.titleLower like '%' || $key2 || '%'))
      or (
        (category.titleLower like '%' || $key0 || '%')
        and (product.titleLower like '%' || $key1 || '%' || $key2 || '%' || $key3 || '%' || $key4 || '%')
      )
    limit 30
  )
order by
  id desc
