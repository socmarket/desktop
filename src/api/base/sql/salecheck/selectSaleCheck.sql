select
  salecheck.id                         as id,
  salecheck.clientId                   as clientId,
  round(salecheck.cash / 100.0, 2)     as cash,
  round(salecheck.discount / 100.0, 2) as discount,
  round(salecheck.change / 100.0, 2)   as change,
  salecheck.soldAt                     as soldAt,
  date(salecheck.soldAt, 'localtime')  as soldAtDate,
  time(salecheck.soldAt, 'localtime')  as soldAtTime
from
  salecheck
where
  id = $id
