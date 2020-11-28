select
  c.id                                 as id,
  c.productId                          as productId,
  c.unitId                             as unitId,
  c.currencyId                         as currencyId,
  round(c.price / 100.0, 2)            as price,
  round(c.originalPrice / 100.0, 2)    as originalPrice,
  round(c.quantity / 100.0, 2)         as quantity,

  round(
    (c.originalPrice - c.price) / 100.0
   , 2)                                as discount,

  round(
    (c.originalPrice / 100.0) *
    (c.quantity / 100.0)
    , 2
  )                                    as cost,

  round(
    (c.price / 100.0) *
    (c.quantity / 100.0)
    , 2
  )                                    as total,

  unit.notation                        as unitTitle,
  currency.notation                    as currencyTitle,
  product.title                        as productTitle,
  product.barcode                      as productBarcode,
  product.model                        as productModel,
  product.engine                       as productEngine,
  product.brand                        as productBrand,
  product.oemNo                        as productOemNo,
  product.serial                       as productSerial,
  category.title                       as categoryTitle
from
  currentsalecheck c
  left join unit     on unit.id     = c.unitId
  left join currency on currency.id = c.currencyId
  left join product  on product.id  = c.productId
  left join category on category.id  = product.categoryId
where
  saleCheckId = $saleCheckId
order by
  c.id asc
