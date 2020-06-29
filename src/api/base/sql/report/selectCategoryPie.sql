select
  category.id,
  category.title,
  productCount
from
  (
    select
      category.id as categoryId,
      count(distinct q.productId) as productCount
    from
      (
        select
          product.id as productId,
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
            coalesce(sum(quantity) / 100.00, 0)
            from currentsalecheck
            where productId = product.id
          ) as outReservedQuantity
        from
          product
        where
          inQuantity - outQuantity - outReservedQuantity > 0
      ) q
      left join product on product.id = q.productId
      left join category on category.id = product.categoryId
    where category.id is not null
    group by category.id
  ) t
  left join category on category.id = t.categoryId
order by
  productCount desc
