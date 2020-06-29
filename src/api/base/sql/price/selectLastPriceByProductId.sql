select
  round(price / 100.0) as price
from (
  select
    price
  from price
  where productId = $productId and currencyId = $currencyId
  order by setAt desc
  limit 1
)

union all

select
  round(price * rate * ($margin / 100.0) + price * rate) as price
from (
  select
    price / 100.00 as price,
    currencyId,
    (
      select cast(rate as decimal) as rate
      from exchangerate
      where
        fromCurrencyId = consignmentitem.currencyId and
        toCurrencyId = $currencyId
      order by updatedAt desc
      limit 1
    ) as rate
  from consignmentitem
  left join consignment on consignment.id = consignmentitem.consignmentId
  where productId = $productId
  order by consignment.acceptedAt desc
  limit 1
)