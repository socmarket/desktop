select
  count(id) as itemCount,
  coalesce(sum(round((actualQuantity - quantity) / 100, 0) * round(coalesce(costPrice, 0) / 100, 0)), 0) as totalCost
from
  currentinventory
where
  inventoryId = $inventoryId
