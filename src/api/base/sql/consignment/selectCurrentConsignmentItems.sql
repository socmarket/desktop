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

  consignmentprice.price / 100.00      as consignmentPrice,

  product.title                        as productTitle,
  product.barcode                      as productBarcode,
  product.model                        as productModel,
  product.engine                       as productEngine,
  product.brand                        as productBrand,
  product.oemNo                        as productOemNo,
  product.serial                       as productSerial
from
  currentconsignment c
  left join unit     on unit.id     = c.unitId
  left join currency on currency.id = c.currencyId
  left join product  on product.id  = c.productId
  left join consignmentprice on consignmentprice.productId = product.id
