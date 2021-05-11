update
  product
set
  barcode       = $barcode
  , unitId      = $unitId
  , categoryId  = $categoryId
  , title       = $title
  , titleLower  = $titleLower
  , brand       = $brand
  , brandLower  = $brandLower
  , notes       = $notes
  , notesLower  = $notesLower
  , model       = $model
  , modelLower  = $modelLower
  , engine      = $engine
  , engineLower = $engineLower
  , oemNo       = $oemNo
  , serial      = $serial
  , coord       = $coord
  , archived    = $archived
  , orderNo     = $orderNo
where
  id = $id
