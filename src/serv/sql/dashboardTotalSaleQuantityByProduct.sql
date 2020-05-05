select
  product.id,
  product.title,
  item.quantity
from
  (
    select
      productId,
      sum(quantity) as quantity
    from
      salecheckitem
    group by
      productId
  ) item
  left join product on product.id = item.productId
