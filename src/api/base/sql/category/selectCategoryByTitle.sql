select
  category.id,
  category.title,
  category.parentId,
  coalesce(parent.title, "") as parentTitle,
  category.notes,
  (select count(id) from product where categoryId = category.id) as productCount
from
  category
  left join category parent on parent.id == category.parentId
where
  category.titleLower like '%' || $pattern || '%'
order by
  category.titleLower asc
