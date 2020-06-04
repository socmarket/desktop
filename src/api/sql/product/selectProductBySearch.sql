select
  id,
  title,
  barcode,
  categoryTitle,
  unitTitle,
  unitId,
  categoryId,
  inQuantity - outQuantity as quantity
from
  (
    select
      product.*,
      unit.title as unitTitle,
      category.title as categoryTitle,
      (select coalesce(sum(quantity), 0) from consignmentitem where productId = product.id) as inQuantity,
      (select coalesce(sum(quantity), 0) from salecheckitem where productId = product.id) as outQuantity
    from
      product
      left join unit     on unit.id     = product.unitId
      left join category on category.id = product.categoryId
    where
      (product.barcode = $barcode)
      or (product.titleLower like '%' || $key0 || '%' || $key1 || '%' || $key2 || '%')
      or ((category.titleLower like '%' || $key0 || '%') and (product.titleLower like '%' || $key1 || '%' || $key2 || '%'))
    limit 30
  ) p
