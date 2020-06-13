select
  day,
  sum(cost) as cost,
  sum(total) as total,
  (sum(total) - sum(cost)) as profit
from
  (
    select
      date(salecheck.soldAt) as day,
      ((salecheckitem.quantity - coalesce(ret.quantity, 0)) * salecheckitem.price) / 100.00 as total,
      (
        select
          sum(consignmentitem.price) / count(consignmentitem.id) / 100.00
        from
          consignmentitem
          left join consignment on consignment.id = consignmentitem.id
        where
          consignment.acceptedAt <= salecheck.soldAt and
          consignmentitem.productId == salecheckitem.productId
      ) as cost
    from
      salecheckitem
      left join salecheck on salecheck.id = salecheckitem.saleCheckId
      left join (
        select saleCheckItemId, sum(quantity) as quantity
        from salecheckreturn
        group by saleCheckItemId
      ) as ret on ret.saleCheckItemId = salecheckitem.id
  )
group by
  day
order by
  day desc
