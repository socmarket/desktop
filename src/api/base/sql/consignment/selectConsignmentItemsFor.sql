select
  consignmentitem.id                                       as id,
  consignmentitem.consignmentId                            as consignmentId,
  consignmentitem.productId                                as productId,
  round(consignmentitem.quantity / 100.00, 2)              as quantity,
  round(consignmentitem.price / 100.00, 2)                 as price,

  round(
    consignmentitem.quantity * consignmentitem.price /
    10000.0,
    2
  )                                                        as costBeforeRet,
  round(
    (consignmentitem.quantity - coalesce(ret.quantity, 0)) *
    consignmentitem.price / 10000.00,
    2
  )                                                        as cost,
  consignmentitem.unitId                                   as uniId,
  consignmentitem.currencyId                               as currencyId,
  product.brand                                            as brand,
  product.barcode                                          as barcode,
  product.oemNo                                            as oemNo,
  coalesce(product.title, "")                              as productTitle,
  category.title                                           as categoryTitle,
  unit.notation                                            as unitNotation,
  currency.notation                                        as currencyNotation,
  coalesce(ret.quantity / 100.00, 0)                       as retQuantity
from
  consignmentitem
  left join product on product.id = consignmentitem.productId
  left join unit on unit.id = consignmentitem.unitId
  left join currency on currency.id = consignmentitem.currencyId
  left join category on category.id = product.categoryId
  left join (
    select consignmentItemId, sum(quantity) as quantity
    from consignmentreturn
    group by consignmentItemId
  ) as ret on ret.consignmentItemId = consignmentitem.id
where
  consignmentitem.consignmentId = $consignmentId
