select
  id,
  round(price / 100, 2) as price,
  setAt,
  currencyId
from
  price
where
  productId = ?
order by setAt desc
