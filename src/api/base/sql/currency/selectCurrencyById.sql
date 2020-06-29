select
  currency.id,
  currency.title,
  currency.notation
from
  currency
where
  currency.id = $currencyId
