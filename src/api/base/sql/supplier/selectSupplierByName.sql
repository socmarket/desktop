select
  supplier.id,
  supplier.name
from
  supplier
where
  supplier.name like '%' || $pattern || '%'
order by
  supplier.name asc
