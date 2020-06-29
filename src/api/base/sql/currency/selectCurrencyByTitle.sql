select
  currency.id,
  currency.title,
  currency.notation
from
  currency
where
  currency.titleLower    like '%' || $pattern || '%' or
  currency.notationLower like '%' || $pattern || '%'
order by
  currency.title asc
