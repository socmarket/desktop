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
      (select
        coalesce(sum(salecheckitem.quantity - ret.quantity), 0)
        from salecheckitem
        left join (
          select saleCheckItemId, sum(quantity) as quantity
          from salecheckreturn
          group by saleCheckItemId
        ) as ret on ret.saleCheckItemId = salecheckitem.id
        where productId = product.id
      ) as outQuantity
    from
      product
      left join unit     on unit.id     = product.unitId
      left join category on category.id = product.categoryId
    where
      (product.barcode = $barcode)
      or (product.titleLower like '%' || $key0 || '%' || $key1 || '%' || $key2 || '%')
      or ((category.titleLower like '%' || $key0 || '%') and (product.titleLower like '%' || $key1 || '%' || $key2 || '%'))
      or ((category.titleLower like '%' || $key0 || '%' || $key1 || '%') and (product.titleLower like '%' || $key2 || '%'))
    limit 30
  ) p
