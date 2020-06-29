select
  category.id,
  category.title,
  category.parentId,
  coalesce(parent.title, "") as parentTitle,
  category.notes
from
  category
  left join category parent on parent.id == category.parentId
where
  category.id = $categoryId
