select
  day,
  round(sum(cost))                as cost,
  round(sum(revenue))             as revenue,
  round(sum(credit))              as credit,
  round(sum(revenue) - sum(cost)) as profit
from
  (
    select
      date(soldAt) as day,
      sum(quantity * coalesce(netprice, 0)) as cost,
      sum(quantity * price) - (case when quantity > 0 then discount else 0 end) as revenue,
      case
        when cash < sum(quantity * price) then sum(quantity * price) - cash - (case when quantity > 0 then discount else 0 end)
        else 0
      end credit
    from
      (
        select
          salecheck.id,
          soldAt,
          productId,
          (salecheckitem.quantity - coalesce(ret.quantity, 0)) / 100.00 as quantity,
          salecheckitem.price / 100.00 as price,
          (
            select
              sum(consignmentitem.price / 100.00) / count(consignmentitem.id)
            from
              consignmentitem
              left join consignment on consignment.id = consignmentitem.consignmentId
            where
              consignment.acceptedAt <= salecheck.soldAt and
              consignmentitem.productId == salecheckitem.productId and
              consignmentitem.quantity > 0
          ) as netprice,
          coalesce(salecheck.discount, 0) / 100.00 as discount,
          coalesce(cash, 0) / 100.00 as cash
        from
          salecheckitem
          left join salecheck on salecheck.id = salecheckitem.saleCheckId
          left join (
            select saleCheckItemId, sum(quantity) as quantity
            from salecheckreturn
            group by saleCheckItemId
          ) as ret on ret.saleCheckItemId = salecheckitem.id
        where
          salecheckitem.quantity > 0 and
          date(salecheck.soldAt) between $start and $end
      ) t
    group by
      id
  ) t
group by
  day
order by
  day desc
