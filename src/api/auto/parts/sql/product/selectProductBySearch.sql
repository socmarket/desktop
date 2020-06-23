select
  *,
  inQuantity - outQuantity as quantity
from
  (
    select
      product.*,
      unit.title as unitTitle,
      category.title as categoryTitle,
      (select coalesce(sum(quantity), 0) from consignmentitem where productId = product.id) as inQuantity,
      (select
        coalesce(sum(salecheckitem.quantity - coalesce(ret.quantity, 0)), 0)
        from salecheckitem
        left join (
          select saleCheckItemId, sum(quantity) as quantity
          from salecheckreturn
          group by saleCheckItemId
        ) as ret on ret.saleCheckItemId = salecheckitem.id
        where productId = product.id
      ) as outQuantity,
      (select
        coalesce(price.price / 100.00, 0) as price
        from
          price
        where
          productId = product.id
        order by
          setAt desc
        limit 1
      ) as price
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
