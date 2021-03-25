select
  unit.id,
  unit.title,
  unit.notation,
  unit.askQuantity
from
  unit
where
  unit.titleLower like '%' || $pattern || '%'
order by
  unit.id asc
