select
  currency.id,
  currency.title
from
  currency
where
  currency.id = $currencyId
