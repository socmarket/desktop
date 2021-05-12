select
  product.id,
  product.title,
  item.quantity
from
  (
    select
      productId,
      sum(quantity) / 100.00 as quantity
    from
      salecheckitem
    group by
      productId
  ) item
  left join product on product.id = item.productId
where
  not product.archived
order by
  item.quantity desc
