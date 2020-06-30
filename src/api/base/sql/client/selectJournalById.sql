select
  registeredAt,
  round(amount) as amount,
  kind
from (
  select
    registeredAt    as registeredAt,
    amount / 100.0 as amount,
    'moneyOut'      as kind
  from
    clientbalance
  where
    amount < 0 and clientbalance.clientId = $clientId

  union all

  select
    registeredAt   as registeredAt,
    amount / 100.0 as amount,
    'moneyIn'      as kind
  from
    clientbalance
  where
    amount > 0 and clientbalance.clientId = $clientId

  union all

  select
    soldAt       as registeredAt,
    - (case
      when (cost - discount) > cash then cost - discount - cash
      else 0
    end)         as amount,
    'sale'       as kind
  from (
    select
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
where
  round(amount) <> 0
order by registeredAt desc
