select
  sum(salecheckitem.quantity) as sold,
  sum(consignmentitem.quantity) as buyed,
where
  productId in (
    select
      productId,
      sum(quantity) as quantity
    from
      salecheckitem
      left join salecheck on salecheck.id = salecheckitem.saleCheckId
    group by
      productId
    order by
      salecheck.soldAt desc
    limit 100
  )
