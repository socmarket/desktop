select
  id,
  barcode,
  title,
  brand,
  model,
  engine,
  oemNo,
  serial
from
  product
where
  id <> $id and barcode = $barcode
