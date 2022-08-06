select
  *,
  inQuantity - outQuantity + invQuantity as totalQuantity,
  inCost - outCost + invCost             as totalCost
from
  (select
    category.title                                       as categoryTitle,
    round(sum(inQuantity))                               as inQuantity,
    round(sum(coalesce(outQuantity, 0)))                 as outQuantity,
    round(sum(coalesce(invQuantity, 0)))                 as invQuantity,
    round(sum(coalesce(inCost, 0)))                      as inCost,
    round(sum(coalesce(outCost, 0)))                     as outCost,
    round(sum(coalesce(invCost, 0)))                     as invCost
  from
    (select * from product where not archived) product
    left join (
      select
        productId                                                                     as productId,
        sum(consignmentitem.quantity - coalesce(ret.quantity, 0))           / 100.00  as inQuantity,
        sum((consignmentitem.quantity - coalesce(ret.quantity, 0)) * price) / 10000.0 as inCost
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
    ) t on t.productId = product.id
    left join (
      select
        productId,
        sum(salecheckitem.quantity - coalesce(ret.quantity, 0)) / 100.00 as outQuantity,
        sum((salecheckitem.quantity - coalesce(ret.quantity, 0)) * price) / 10000.0 as outCost
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
    ) sold on sold.productId = product.id
    left join (
      select
        productId,
        sum(actualQuantity - quantity) / 100.00 as invQuantity,
        sum((actualQuantity - quantity) * costPrice) / 10000.00 as invCost
      from
        inventoryitem
      group by productId
    ) inv on inv.productId = product.id
    left join category on category.id = product.categoryId
  group by
    category.id
  ) t
