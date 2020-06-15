select
  days.day,
  abs(coalesce(sd.debit, 0) + coalesce(d.debit, 0)) as debit,
  abs(coalesce(sc.credit, 0) + coalesce(c.credit, 0)) as credit
from
  (
    select date(soldAt) as day from salecheck where clientId = $clientId
    union
    select date(registeredAt) as day from clientbalance where clientId = $clientId
  ) days
  left join (
    select
      date(salecheck.soldAt) as day,
      0.00 as debit,
      sum(quantity * price) / 100.0 as credit
    from
      salecheckitem
      left join salecheck on salecheck.id = salecheckitem.saleCheckId
    where
      salecheck.clientId = $clientId
    group by
      date(salecheck.soldAt)
  ) sc on sc.day = days.day
  left join (
    select
      day,
      sum(debit) as debit,
      sum(credit) as credit
    from (
      select
        date(salecheck.soldAt) as day,
        case
          when sum(quantity * (price / 100.0)) > cash then cash
          else sum(quantity * (price / 100.0))
        end as debit,
        0.00 as credit
      from
        salecheck
        left join salecheckitem on salecheckitem.saleCheckId = salecheck.id
      where
        salecheck.clientId = $clientId
      group by
        salecheck.id
    ) t
    group by t.day
  ) sd on sd.day = days.day
  left join (
    select
      date(clientbalance.registeredAt) as day,
      0.00 as debit,
      sum(amount) / 100.0 as credit
    from
      clientbalance
    where
      clientbalance.clientId = $clientId and amount < 0
    group by
      date(clientbalance.registeredAt)
  ) c on c.day = days.day
  left join (
    select
      date(clientbalance.registeredAt) as day,
      sum(amount) / 100.0 as debit,
      0.00 as credit
    from
      clientbalance
    where
      clientbalance.clientId = $clientId and amount >= 0
    group by
      date(clientbalance.registeredAt)
  ) d on d.day = days.day
order by
  days.day desc
