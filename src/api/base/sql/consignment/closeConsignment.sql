insert into consignmentitem(
  consignmentId,
  productId,
  quantity,
  price,
  unitId,
  currencyId
) select 
  $currentConsignmentId,
  productId,
  quantity,
  price,
  unitId,
  currencyId
from currentconsignment
where
  consignmentId = $consignmentId
order by
  currentconsignment.id asc
