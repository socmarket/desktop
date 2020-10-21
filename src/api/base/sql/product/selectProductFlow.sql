select
  opAt,
  amount,
  units,
  op
from (
  select
    soldAt                                   as opAt,
    round((salecheckitem.quantity -
        coalesce(ret.quantity, 0)) / 100, 2) as amount,
    unit.notation                            as units,
    'sale'                                   as op
  from
    salecheckitem
    left join salecheck on salecheck.id = salecheckitem.saleCheckId
    left join unit on unit.id = salecheckitem.unitId
    left join (
      select saleCheckItemId, sum(quantity) as quantity
      from salecheckreturn
      group by saleCheckItemId
    ) as ret on ret.saleCheckItemId = salecheckitem.id
  where
    productId = $productId

  union all

  select
    acceptedAt                               as opAt,
    round((consignmentitem.quantity -
        coalesce(ret.quantity, 0)) / 100, 2) as amount,
    unit.notation                            as units,
    'consignment'                            as op
  from
    consignmentitem
    left join consignment on consignment.id = consignmentitem.consignmentId
    left join unit on unit.id = consignmentitem.unitId
    left join (
      select consignmentItemId, sum(quantity) as quantity
      from consignmentreturn
      group by consignmentItemId
    ) as ret on ret.consignmentItemId = consignmentitem.id
  where
    productId = $productId

  union all

  select
    updatedAt                             as opAt,
    round(price / 100.00, 2)              as amount,
    currency.notation                     as units,
    'inPriceSet'                          as op
  from
    consignmentprice
    left join currency on currency.id = consignmentprice.currencyId
  where
    productId = $productId

  union all

  select
    setAt                                 as opAt,
    round(price / 100.00, 2)              as amount,
    currency.notation                     as units,
    'outPriceSet'                         as op
  from
    price
    left join currency on currency.id = price.currencyId
  where
    productId = $productId
)
order by
  opAt desc
