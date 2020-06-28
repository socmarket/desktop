insert into consignmentitem(
  consignmentId,
  productId,
  quantity,
  price,
  unitId,
  currencyId
) select 
  $consignmentId,
  productId,
  quantity,
  price,
  unitId,
  currencyId
from currentconsignment
