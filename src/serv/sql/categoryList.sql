select
  category.id,
  category.title,
  category.parentId,
  parent.title as parentTitle
from
  category
  left join category parent on parent.id == category.parentId
