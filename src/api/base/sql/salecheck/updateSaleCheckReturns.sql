update salecheckreturn
set saleCheckItemId = (
  select id
  from salecheckitem i
  where i.productId = salecheckreturn.savedProductId and i.saleCheckId = $saleCheckId
)
where
  savedSaleCheckId = $saleCheckId
