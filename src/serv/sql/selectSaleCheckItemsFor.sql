select
  salecheckitem.id,
  salecheckitem.salecheckId,
  salecheckitem.productId,
  salecheckitem.quantity,
  salecheckitem.price,
  salecheckitem.unitId,
  salecheckitem.currencyId,
  product.title as productTitle,
  unit.notation as unitNotation
from
  salecheckitem
  left join product on product.id = salecheckitem.productId
  left join unit on unit.id = salecheckitem.unitId
where
  salecheckitem.saleCheckId = $saleCheckId
