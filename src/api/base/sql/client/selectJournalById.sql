select
  id,
  registeredAt,
  round(amount) as amount,
  kind
from (
  select
    -1             as id,
    registeredAt   as registeredAt,
    amount / 100.0 as amount,
    'moneyOut'     as kind
  from
    clientbalance
  where
    amount < 0 and clientbalance.clientId = $clientId

  union all

  select
    -1             as id,
    registeredAt   as registeredAt,
    amount / 100.0 as amount,
    'moneyIn'      as kind
  from
    clientbalance
  where
    amount > 0 and clientbalance.clientId = $clientId

  union all

  select
    id           as id,
    soldAt       as registeredAt,
    - (case
      when (cost - discount) > cash then cost - discount - cash
      else 0
    end)         as amount,
    'sale'       as kind
  from (
    select
      salecheck.id as id,
      soldAt       as soldAt,
      cash / 100.0 as cash,
      salecheck.discount / 100.0 as discount,
      sum((salecheckitem.quantity - coalesce(ret.quantity, 0)) * price) / 10000.0 as cost
    from salecheckitem
    left join salecheck           on salecheck.id = salecheckitem.saleCheckId
    left join salecheckreturn ret on ret.saleCheckItemId = salecheckitem.id
    where salecheck.clientId = $clientId
    group by salecheck.id
  ) t
) t
order by registeredAt desc
