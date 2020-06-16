select
  id,
  title,
  barcode,
  categoryTitle,
  unitTitle,
  unitId,
  categoryId,
  inQuantity - outQuantity as quantity,
  price
from
  (
    select
      product.*,
      unit.title as unitTitle,
      category.title as categoryTitle,
      (select coalesce(sum(quantity), 0) from consignmentitem where productId = product.id) as inQuantity,
      (select coalesce(sum(quantity), 0) from salecheckitem where productId = product.id) as outQuantity,
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
      (product.id = $productId)
  ) p
