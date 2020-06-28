select
  id,
  name,
  contacts,
  notes,
  round(coalesce(balance, 0) - coalesce(cost, 0)) as balance
from (
  select
    client.id                 as id,
    client.name               as name,
    client.contacts           as contacts,
    client.notes              as notes,
    (
      select
        coalesce(sum(amount / 100.0), 0)
      from
        clientbalance
      where
        clientbalance.clientId = client.id
    )                         as balance,

    (
      select
        sum(case
          when (cost - discount) > cash then cost - discount - cash
          else 0
        end) as cost
      from (
        select
          cash / 100.0 as cash,
          salecheck.discount / 100.0 as discount,
          sum((salecheckitem.quantity - coalesce(ret.quantity, 0)) * price) / 10000.0 as cost
        from salecheckitem
        left join salecheck           on salecheck.id = salecheckitem.saleCheckId
        left join salecheckreturn ret on ret.saleCheckItemId = salecheckitem.id
        where salecheck.clientId = client.id
        group by salecheck.id
      ) t
    )                         as cost
  from
    client
  where
    client.nameLower like '%' || $pattern || '%'
  order by
    client.name asc
) t
