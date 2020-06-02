select * from (
  select
    product.*,
    coalesce(category.title, '') as categoryTitle
  from
    product
    left join (select productId from price group by productId)           p on p.productId = product.id
    left join (select productId from consignmentitem group by productId) c on c.productId = product.id
    left join category on category.id = product.categoryId
  where
    p.productId is null
    and c.productId is not null
    and product.id > $productId
  order by
    product.id asc
  limit 1
)
union all
select * from (
  select
    product.*,
    coalesce(category.title, '') as categoryTitle
  from
    product
    left join (select productId from price group by productId)           p on p.productId = product.id
    left join (select productId from consignmentitem group by productId) c on c.productId = product.id
    left join category on category.id = product.categoryId
  where
    p.productId is null
    and c.productId is not null
  order by
    product.id asc
  limit 1
)
