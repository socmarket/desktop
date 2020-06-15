select
  id,
  name,
  coalesce(balance1, 0) - coalesce(balance2, 0) + coalesce(balance3, 0) as balance
from
  (
    select
      client.id,
      client.name,
      (
        select sum(amount) / 100
        from clientbalance
        where clientbalance.clientId = client.id
      ) as balance1,
      (
        select sum(quantity * (price / 100))
        from salecheckitem
        left join salecheck on salecheck.id = salecheckitem.saleCheckId
        where salecheck.clientId = client.id
      ) as balance2,
      (
        select
          sum(cash)
        from (
          select
            date(salecheck.soldAt) as day,
            case
              when sum(quantity * (price / 100.0)) > cash then cash
              else sum(quantity * (price / 100.0))
            end as cash
          from
            salecheck
            left join salecheckitem on salecheckitem.saleCheckId = salecheck.id
          where
            salecheck.clientId = client.id
          group by
            salecheck.id
        )
      ) as balance3
    from
      client
    where
      client.nameLower like '%' || $pattern || '%'
    order by
      client.nameLower asc
  )
