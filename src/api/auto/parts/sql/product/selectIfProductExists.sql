select
  id, title, barcode
from
  product
where
  ($brand = brand) and
  (
    (
      (length($barcode) = 0 and length($oemNo) > 0 and oemNo = $oemNo) or
      (length($barcode) > 0 and barcode = $barcode)
    ) or (
      title = $title and
      (length($oemNo) = 0 or $oemNo is null) and
      (length($barcode) = 0 or $barcode is null)
    )
  )
