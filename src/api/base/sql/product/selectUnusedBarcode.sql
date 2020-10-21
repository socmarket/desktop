select
  $prefix || substr('0000000000' || cast(code as string), -9, 9) as barcode
from
  barcode
where
  $prefix || substr('0000000000' || cast(code as string), -9, 9) not in (select barcode from product)
