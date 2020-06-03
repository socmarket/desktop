select
  salecheck.id     as id,
  client.name      as clientName,
  salecheck.cash   as cash,
  salecheck.change as change,
  salecheck.soldAt as soldAt,
  (
    select
      sum (quantity * price) / 100.0 as cost
    from
      salecheckitem
    where salecheckitem.saleCheckId = salecheck.id
  )                as cost
from
  salecheck
  left join client on client.id = salecheck.clientId
order by
  salecheck.soldAt desc
