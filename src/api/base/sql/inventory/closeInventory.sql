insert into inventoryitem(
  inventoryId,
  productId,
  productTitle,
  quantity,
  actualQuantity,
  diffQuantity,
  sellPrice,
  costPrice,
  unitId,
  currencyId
) select 
  $createdInventoryId,
  productId,
  productTitle,
  quantity,
  actualQuantity,
  diffQuantity,
  sellPrice,
  costPrice,
  unitId,
  currencyId
from currentinventory
where
  inventoryId = $inventoryId
order by
  currentinventory.id asc
