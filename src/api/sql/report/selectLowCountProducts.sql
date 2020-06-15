select
  productId,
  product.title as title,
  category.title as categoryTitle,
  outQuantity,
  inQuantity,
  (inQuantity - outQuantity) as remainingQuantity,
  clientQuantity
from
  (
    select
      productId,
      sum(salecheckitem.quantity - coalesce(ret.quantity, 0)) as outQuantity,
      count(distinct salecheck.id) as clientQuantity,
      (select coalesce(sum(quantity), 0) from consignmentitem where productId = salecheckitem.productId) as inQuantity
    from
      salecheckitem
      left join salecheck on salecheck.id = salecheckitem.saleCheckId
      left join (
        select saleCheckItemId, sum(quantity) as quantity
        from salecheckreturn
        group by saleCheckItemId
      ) as ret on ret.saleCheckItemId = salecheckitem.id
    where
      salecheck.soldAt between $start and $end
    group by
      productId
  ) t
  left join product on product.id = t.productId
  left join category on category.id = product.categoryId
where (inQuantity - outQuantity) < 3
order by
  outQuantity desc,
  (inQuantity - outQuantity) asc
