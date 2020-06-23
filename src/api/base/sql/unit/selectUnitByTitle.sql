select
  unit.id,
  unit.title
from
  unit
where
  unit.title like '%' || $pattern || '%'
order by
  unit.title asc
