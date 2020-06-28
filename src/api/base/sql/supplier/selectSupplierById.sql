select
  supplier.id,
  supplier.name
from
  supplier
where
  supplier.id = $supplierId
