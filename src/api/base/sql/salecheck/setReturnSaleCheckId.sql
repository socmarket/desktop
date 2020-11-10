update salecheckreturn
set
  savedSaleCheckId = $saleCheckId,
  savedProductId = (select productId from salecheckitem where id = salecheckreturn.saleCheckItemId)
where
  saleCheckItemId in (select id from salecheckitem where saleCheckId = $saleCheckId)
