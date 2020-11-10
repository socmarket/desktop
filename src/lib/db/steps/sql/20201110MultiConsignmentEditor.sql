alter table currentconsignment rename to old_currentconsignment;

create table currentconsignment(
  id integer primary key autoincrement,
  productId int,
  quantity long,
  price long,
  unitId int default -1,
  currencyId int default -1,
  consignmentId int default -1,
  unique(consignmentId, productId)
);

insert into currentconsignment(
  id, productId, quantity, price, unitId, currencyId, consignmentId
) select
  id, productId, quantity, price, unitId, currencyId, -1
from
  old_currentconsignment
;

drop table old_currentconsignment;

alter table consignmentreturn add column savedProductId int default null;
alter table consignmentreturn add column savedConsignmentId int default null;
