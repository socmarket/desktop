select
  item.id                  as id,
  product.title            as title,
  item.quantity            as quantity,
  item.price               as price,
  item.quantity*item.price as cost,
  salecheck.cash           as cash,
  salecheck.soldAt         as soldAt
from
  salecheckitem item
  left join product on product.id = item.productId
  left join salecheck on salecheck.id = item.saleCheckId
