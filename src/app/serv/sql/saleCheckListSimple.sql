select
  soldAt,
  round(total, 2) as total,
  cash,
  round(cash - total, 2) as change,
  clientName
from (
  select
    saleCheck.soldAt,
    (select sum(price / 100.00 * quantity) from salecheckitem where saleCheckId = salecheck.id) as total,
    saleCheck.cash,
    client.name as clientName
  from salecheck
  left join client on client.id = salecheck.clientId
  order by salecheck.soldAt desc
  limit 2
)
