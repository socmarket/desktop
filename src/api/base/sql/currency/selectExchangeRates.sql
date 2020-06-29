with t as (
  select
    fromCurrencyId,
    toCurrencyId,
    fromCurrency.title as fromCurrencyTitle,
    toCurrency.title as toCurrencyTitle,
    fromCurrency.notation as fromCurrencyNotation,
    toCurrency.notation as toCurrencyNotation,
    cast(rate as decimal) as rate,
    updatedAt,
    row_number() over(
      partition by fromCurrencyId, toCurrencyId
      order by updatedAt desc
    ) as idx
  from
    exchangerate
    left join currency fromCurrency on fromCurrency.id = exchangerate.fromCurrencyId
    left join currency toCurrency   on toCurrency.id   = exchangerate.toCurrencyId
)

select
 *
from t
where idx = 1
