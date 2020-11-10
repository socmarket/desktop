update
  currentconsignment
set
  productId    = $productId
  , quantity   = round($quantity * 100)
  , price      = round($price * 100)
  , unitId     = $unitId
  , currencyId = $currencyId
where
  id = $id
