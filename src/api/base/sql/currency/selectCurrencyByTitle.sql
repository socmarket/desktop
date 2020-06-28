select
  currency.id,
  currency.title
from
  currency
where
  currency.title like '%' || $pattern || '%'
order by
  currency.title asc
