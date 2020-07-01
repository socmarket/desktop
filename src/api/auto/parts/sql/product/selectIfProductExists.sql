select
  id, title, barcode
from
  product
where
  title = $title and
  (
    (
      (length($oemNo) > 0 and oemNo = $oemNo) or
      (length($serial) > 0 and serial = $serial) or
      (length($barcode) > 0 and barcode = $barcode)
    ) or (
      (length($oemNo) = 0  or $oemNo is null) and
      (length($serial) = 0 or $serial is null) and
      (length($barcode) = 0 or $barcode is null)
    )
  )
