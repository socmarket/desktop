insert into currentinventory(
  productId,
  productTitle,
  quantity,
  actualQuantity,
  diffQuantity,
  costPrice,
  sellPrice,
  unitId,
  currencyId,
  inventoryId
) values (
  $productId,
  $productTitle,
  round($quantity * 100),
  round($actualQuantity * 100),
  round($actualQuantity * 100 - $quantity * 100),
  round($costPrice * 100),
  round($sellPrice * 100),
  $unitId,
  $currencyId,
  coalesce($inventoryId, -1)
)
on conflict(productId, inventoryId) do update set
  quantity       = excluded.quantity,
  actualQuantity = excluded.actualQuantity,
  diffQuantity   = excluded.diffQuantity,
  costPrice      = excluded.costPrice,
  sellPrice      = excluded.sellPrice,
  unitId         = excluded.unitId,
  currencyId     = excluded.currencyId
;
