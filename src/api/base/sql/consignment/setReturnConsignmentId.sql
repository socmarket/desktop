update consignmentreturn
set
  savedConsignmentId = $consignmentId,
  savedProductId = (select productId from consignmentitem where id = consignmentreturn.consignmentItemId)
where
  consignmentItemId in (select id from consignmentitem where consignmentId = $consignmentId)

