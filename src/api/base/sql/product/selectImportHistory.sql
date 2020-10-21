select
  importinfo.*,
  unit.notation as unitNotation,
  category.title as categoryTitle,
  currency.notation as currencyNotation
from
  importinfo
  left join unit on unit.id = importinfo.unitId
  left join category on category.id = importinfo.categoryId
  left join currency on currency.id = importinfo.currencyId
order by
  importinfo.id desc
