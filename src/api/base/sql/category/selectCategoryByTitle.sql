select
  category.id,
  category.title,
  category.parentId,
  coalesce(parent.title, "") as parentTitle
from
  category
  left join category parent on parent.id == category.parentId
where
  category.titleLower like '%' || $pattern || '%'
order by
  category.titleLower asc
