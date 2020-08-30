select
  round(price / 100.0, 2) as price,
  setAt                 as setAt,
  currencyId            as currencyId,
  currency.notation     as currencyNotation
from
  price
  left join currency on currency.id = price.currencyId
where
  productId = $productId
order by
  setAt desc
