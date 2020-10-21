select
  id,
  unitId
from
  product
where
  (
    (length($oemNo)   > 0 and oemNo   = $oemNo  ) or
    (length($barcode) > 0 and barcode = $barcode)
  ) and
  (brand = $brand)
