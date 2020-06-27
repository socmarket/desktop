select
  salecheckitem.id,
  salecheckitem.salecheckId,
  salecheckitem.productId,
  salecheckitem.quantity / 100.00  as quantity,
  salecheckitem.price / 100.00     as price,
  (salecheckitem.quantity * salecheckitem.price) / 10000.00 as costBeforeRet,
  ((salecheckitem.quantity - coalesce(ret.quantity, 0)) * salecheckitem.price) / 10000.00 as cost,
  salecheckitem.unitId,
  salecheckitem.currencyId,
  product.title as productTitle,
  unit.notation as unitNotation,
  coalesce(ret.quantity / 100.00, 0) as retQuantity
from
  salecheckitem
  left join product on product.id = salecheckitem.productId
  left join unit on unit.id = salecheckitem.unitId
  left join (
    select saleCheckItemId, sum(quantity) as quantity
    from salecheckreturn
    group by saleCheckItemId
  ) as ret on ret.saleCheckItemId = salecheckitem.id
where
  salecheckitem.saleCheckId = $saleCheckId
