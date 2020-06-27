select
  salecheck.id       as id,
  client.name        as clientName,
  salecheck.cash     as cash,
  salecheck.discount as discount,
  salecheck.change   as change,
  salecheck.soldAt   as soldAt,
  (
    select sum ((salecheckitem.quantity - coalesce(ret.quantity, 0)) / 100 * price) / 100.0 as cost
    from salecheckitem
    left join (
      select saleCheckItemId, sum(quantity) as quantity
      from salecheckreturn
      group by saleCheckItemId
    ) as ret on ret.saleCheckItemId = salecheckitem.id
    where salecheckitem.saleCheckId = salecheck.id
  )                as cost
from
  salecheck
  left join client on client.id = salecheck.clientId
order by
  salecheck.soldAt desc
