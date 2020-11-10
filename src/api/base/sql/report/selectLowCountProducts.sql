select
  productId,
  product.title as title,
  category.title as categoryTitle,
  outQuantity,
  inQuantity,
  (inQuantity - outQuantity - outReservedQuantity) as remainingQuantity,
  clientQuantity
from
  (
    select
      productId,
      outQuantity,
      clientQuantity,
      (select
        coalesce(sum(consignmentitem.quantity - coalesce(ret.quantity, 0)) / 100.00, 0)
        from consignmentitem
        left join (
          select consignmentItemId, sum(quantity) as quantity
          from consignmentreturn
          group by consignmentItemId
        ) as ret on ret.consignmentItemId = consignmentitem.id
        where productId = t.productId
      ) as inQuantity,
      (select coalesce(sum(quantity) / 100.00, 0)
        from currentsalecheck
        where productId = t.productId and saleCheckId = -1
      ) as outReservedQuantity
    from
      (
        select
          productId,
          sum(salecheckitem.quantity - coalesce(ret.quantity, 0)) / 100.00 as outQuantity,
          count(distinct salecheck.id) as clientQuantity
        from
          salecheckitem
          left join salecheck on salecheck.id = salecheckitem.saleCheckId
          left join (
            select saleCheckItemId, sum(quantity) as quantity
            from salecheckreturn
            group by saleCheckItemId
          ) as ret on ret.saleCheckItemId = salecheckitem.id
        group by
          productId
        order by
          salecheck.soldAt desc
        limit 200
      ) as t
  ) q
  left join product on product.id = q.productId
  left join category on category.id = product.categoryId
where remainingQuantity <= 1
order by
  remainingQuantity asc,
  clientQuantity desc
