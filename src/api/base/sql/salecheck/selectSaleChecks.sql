select
  salecheck.id                         as id,
  client.name                          as clientName,
  round(salecheck.cash / 100.0, 2)     as cash,
  round(salecheck.discount / 100.0, 2) as discount,
  round(salecheck.change / 100.0, 2)   as change,
  salecheck.soldAt                     as soldAt,
  date(salecheck.soldAt, 'localtime')  as soldAtDate,
  time(salecheck.soldAt, 'localtime')  as soldAtTime,
  (
    select sum ((salecheckitem.quantity - coalesce(ret.quantity, 0)) * price) / 10000.0 as cost
    from salecheckitem
    left join (
      select saleCheckItemId, sum(quantity) as quantity
      from salecheckreturn
      group by saleCheckItemId
    ) as ret on ret.saleCheckItemId = salecheckitem.id
    where salecheckitem.saleCheckId = salecheck.id
  )                                  as cost
from
  salecheck
  left join client on client.id = salecheck.clientId
where
  $all 
  or date(salecheck.soldAt, 'localtime') = $day
order by
  salecheck.soldAt desc
limit 2000
