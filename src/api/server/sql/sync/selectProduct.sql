select
  id,
  barcode,
  code,
  title,
  notes,
  unitId,
  categoryId,
  brand,
  model,
  engine,
  oemNo,
  serial,
  coord
from
  product
where
  id not in (select id from sync where entity = 'product')
limit $limit
