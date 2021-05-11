select
  count(i.id) as itemCount,
  coalesce(sum(round((i.actualQuantity - i.quantity) / 100, 0) * round(coalesce(i.costPrice, 0) / 100, 0)), 0) as totalCost
from
  currentinventory i
  left join product p on p.id = i.productId
where
  not p.archived
  and i.inventoryId = $inventoryId
