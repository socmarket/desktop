select
  categoryTitle,
  uniqueQuantity,
  quantity,
  cost
from
  (
    select
      category.title as categoryTitle,
      sum(ci.price / 100.00 * ci.quantity) as cost,
      count(distinct ci.productId) as uniqueQuantity,
      sum(ci.quantity) as quantity
    from
      consignmentitem ci
      left join product on product.id = ci.productId
      left join category on category.id = product.categoryId
    group by
      category.title
  ) t
order by
  cost desc,
  quantity desc
