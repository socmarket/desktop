select
  *,
  inQuantity - outQuantity - outReservedQuantity + correctedQuantity as quantity
from
  (
    select
      product.*,
      unit.notation as unitNotation,
      unit.title as unitTitle,
      unit.askQuantity as unitAskQuantity,
      category.title as categoryTitle,
      (select
        coalesce(sum(consignmentitem.quantity - coalesce(ret.quantity, 0)) / 100.00, 0)
        from consignmentitem
        left join (
          select consignmentItemId, sum(quantity) as quantity
          from consignmentreturn
          group by consignmentItemId
        ) as ret on ret.consignmentItemId = consignmentitem.id
        where productId = product.id
      ) as inQuantity,
      (select
        coalesce(sum(salecheckitem.quantity - coalesce(ret.quantity, 0)) / 100.00, 0)
        from salecheckitem
        left join (
          select saleCheckItemId, sum(quantity) as quantity
          from salecheckreturn
          group by saleCheckItemId
        ) as ret on ret.saleCheckItemId = salecheckitem.id
        where productId = product.id
      ) as outQuantity,
      (select
        coalesce(round(sum(quantity) / 100.00, 2), 0)
        from currentsalecheck
        where productId = product.id and saleCheckId = -1
      ) as outReservedQuantity,
      (select
        coalesce(round(sum(actualQuantity - quantity) / 100.00, 2), 0)
        from inventoryitem
        where productId = product.id
      ) as correctedQuantity,
      (select
        coalesce(round(price.price / 100.00, 2), 0.0) as price
        from
          price
        where
          productId = product.id
        order by
          setAt desc
        limit 1
      ) as price
    from
      (select product.* from product left join category on category.id = product.categoryId
        where
          category.id = $categoryId and (product.archived = $archived) and (
            (product.barcode = $barcode)
            or (product.titleLower  like '%' || $key0 || '%' || $key1 || '%' || $key2 || '%')
          )
        order by product.orderNo desc, product.id desc
        limit $limit
        offset $offset
      ) product
      left join unit     on unit.id     = product.unitId
      left join category on category.id = product.categoryId
  ) p
