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
  serial
) values(
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
  ''
)
