insert into product(
  barcode,

  title,
  titleLower,

  brand,
  brandLower,

  notes,
  notesLower,

  unitId,
  categoryId,

  model,
  modelLower,
  engine,
  engineLower,
  oemNo,
  serial,
  coord,
  archived,
  orderNo
) select
  $barcode,

  $title,
  $titleLower,

  $brand,
  $brandLower,

  $notes,
  $notesLower,

  $unitId,
  $categoryId,

  $model,
  $modelLower,
  $engine,
  $engineLower,
  $oemNo,
  $serial,
  $coord,
  $archived,
  coalesce(max(orderNo), 0) + 1
from
  product
