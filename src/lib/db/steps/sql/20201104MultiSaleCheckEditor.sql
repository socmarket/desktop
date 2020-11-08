alter table currentsalecheck rename to old_currentsalecheck;

create table currentsalecheck(
  id integer primary key autoincrement,
  productId int,
  quantity long,
  price long,
  originalPrice long,
  unitId int default -1,
  currencyId int default -1,
  saleCheckId int default -1,
  unique(saleCheckId, productId)
);

insert into currentsalecheck(
  id, productId, quantity, price, originalPrice, unitId, currencyId, saleCheckId
) select
  id, productId, quantity, price, originalPrice, unitId, currencyId, -1
from
  old_currentsalecheck
;

drop table old_currentsalecheck;
