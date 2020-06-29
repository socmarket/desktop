select
  unit.id,
  unit.title,
  unit.notation
from
  unit
where
  unit.titleLower like '%' || $pattern || '%'
order by
  unit.title asc
