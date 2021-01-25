select
  category.title                                       as categoryTitle,
  round(sum(quantity))                                 as inQuantity,
  round(sum(coalesce(soldQuantity, 0)))                as outQuantity,
  round(sum(coalesce(invQuantity, 0)))                 as invQuantity,
  round(sum(cost))                                     as inCost,
  round(sum(coalesce(soldQuantity, 0) * price))        as outCost,
  round(sum(coalesce(invPrice * invQuantity, 0)))      as invCost,
  round(
    sum(cost - coalesce(soldQuantity, 0) * price)
    + sum(coalesce(invPrice * invQuantity, 0))
  )                                                    as total
from
  (
    select
      productId                                                                     as productId,
      sum(consignmentitem.quantity - coalesce(ret.quantity, 0))           / 100.00  as quantity,
      sum((consignmentitem.quantity - coalesce(ret.quantity, 0)) * price) / 10000.0 as cost,
      max(price)                                                          / 100.00  as price
    from
      consignmentitem
      left join (
        select consignmentItemId, sum(quantity) as quantity
        from consignmentreturn
        group by consignmentItemId
      ) as ret on ret.consignmentItemId = consignmentitem.id
    where
      consignmentitem.quantity > 0
    group by
      productId
  ) t
  left join (
    select
      productId,
      sum(salecheckitem.quantity - coalesce(ret.quantity, 0)) / 100.00 as soldQuantity
    from
      salecheckitem
      left join (
        select saleCheckItemId, sum(quantity) as quantity
        from salecheckreturn
        group by saleCheckItemId
      ) as ret on ret.saleCheckItemId = saleCheckitem.id
    where
      salecheckitem.quantity > 0
    group by productId
  ) sold on sold.productId = t.productId
  left join (
    select
      productId,
      sum(actualQuantity - quantity) / 100.00 as invQuantity,
      sum(costPrice) / 100.00 as invPrice
    from
      inventoryitem
    group by productId
  ) inv on inv.productId = t.productId
  left join product  on product.id = t.productId
  left join category on category.id = product.categoryId
group by
  category.id
