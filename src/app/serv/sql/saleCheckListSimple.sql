select
  saleCheck.soldAt,
  (select sum(price / 100 * quantity) from salecheckitem where saleCheckId = salecheck.id) as total
from salecheck
order by salecheck.soldAt desc
limit 5
