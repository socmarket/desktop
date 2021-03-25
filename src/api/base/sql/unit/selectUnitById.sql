select
  unit.id,
  unit.notation,
  unit.title,
  unit.askQuantity
from
  unit
where
  unit.id = $unitId
