create table consignment(
  id integer primary key autoincrement,
  supplierId int default -1,
  acceptedAt datetime default current_timestamp,
  closed boolean default false
);

create table consignmentitem(
  id integer primary key autoincrement,
  consignmentId int,
  productId int,
  quantity long,
  price long,
  unitId int default -1,
  currencyId int default -1
);

