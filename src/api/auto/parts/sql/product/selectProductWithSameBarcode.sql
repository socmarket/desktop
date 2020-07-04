select
  id,
  barcode,
  title,
  brand,
  model,
  engine,
  oemNo
from
  product
where
  id <> $id and barcode = $barcode
