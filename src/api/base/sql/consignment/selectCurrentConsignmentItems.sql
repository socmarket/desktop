select
  c.id                                 as id,
  c.productId                          as productId,
  c.unitId                             as unitId,
  c.currencyId                         as currencyId,
  round(c.price / 100, 2)              as price,
  round(c.quantity / 100, 2)           as quantity,

  round(
    (c.price / 100) *
    (c.quantity / 100)
    , 2
  )                                    as cost,

  unit.notation                        as unitTitle,
  currency.notation                    as currencyTitle,
  product.title                        as productTitle,
  product.barcode                      as productBarcode
from
  currentconsignment c
  left join unit     on unit.id     = c.unitId
  left join currency on currency.id = c.currencyId
  left join product  on product.id  = c.productId
