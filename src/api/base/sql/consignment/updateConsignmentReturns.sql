update consignmentreturn
set consignmentItemId = (
  select id
  from consignmentitem i
  where i.productId = consignmentreturn.savedProductId and i.consignmentId = $consignmentId
)
where
  savedConsignmentId = $consignmentId
