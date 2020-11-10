insert into currentconsignment(
  consignmentId,
  productId,
  quantity,
  price,
  unitId,
  currencyId
) select 
  consignmentId,
  productId,
  quantity,
  price,
  unitId,
  currencyId
from consignmentitem
where
  consignmentId = $consignmentId
