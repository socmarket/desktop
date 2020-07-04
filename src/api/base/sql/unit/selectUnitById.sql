select
  unit.id,
  unit.notation,
  unit.title
from
  unit
where
  unit.id = $unitId
