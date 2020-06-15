select
  category.id,
  category.title,
  productCount
from
  (
    select
      category.id as categoryId,
      count(distinct t.productId) as productCount
    from
      (
        select
          ip.productId,
          ip.quantity - op.quantity as quantity
        from
          (select productId, sum(quantity) as quantity from consignmentitem group by productId) as ip
          left join (
            select
              productId,
              sum(salecheckitem.quantity - coalesce(ret.quantity, 0)) as quantity
            from
              salecheckitem
            left join salecheck on salecheck.id = salecheckitem.saleCheckId
            left join (
              select saleCheckItemId, sum(quantity) as quantity
              from salecheckreturn
              group by saleCheckItemId
            ) as ret on ret.saleCheckItemId = salecheckitem.id
            group by productId
         ) as op
        where
          (ip.quantity - op.quantity) > 0
      ) t
      left join product on product.id = t.productId
      left join category on category.id = product.categoryId
    where category.id is not null
    group by category.id
  ) t
  left join category on category.id = t.categoryId
order by
  productCount desc
