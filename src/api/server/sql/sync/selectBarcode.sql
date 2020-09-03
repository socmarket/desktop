select
  code as id,
  code as code
from
  barcode
where
  code not in (select id from sync where entity = 'barcode')
limit $limit
