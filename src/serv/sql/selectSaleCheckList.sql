select
  salecheck.id     as id,
  client.name      as clientName,
  salecheck.cash   as cash,
  salecheck.cash   as change,
  salecheck.soldAt as soldAt
from
  salecheck
  left join client on client.id = salecheck.clientId
order by
  salecheck.soldAt desc
