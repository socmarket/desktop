select
  salecheckitem.id                                         as id,
  salecheckitem.saleCheckId                                as saleCheckId,
  salecheckitem.productId                                  as productId,
  round(salecheckitem.quantity / 100.00, 2)                as quantity,
  round(salecheckitem.price / 100.00, 2)                   as price,

  round(
    salecheckitem.quantity * salecheckitem.price /
    10000.0,
    2
  )                                                        as costBeforeRet,
  round(
    (salecheckitem.quantity - coalesce(ret.quantity, 0)) *
    salecheckitem.price / 10000.00,
    2
  )                                                        as cost,
  salecheckitem.unitId                                     as uniId,
  salecheckitem.currencyId                                 as currencyId,
  product.barcode                                          as barcode,
  product.oemNo                                            as oemNo,
  product.title                                            as productTitle,
  unit.notation                                            as unitNotation,
  coalesce(ret.quantity / 100.00, 0)                       as retQuantity
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
