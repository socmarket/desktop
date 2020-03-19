create table salecheck(
  id integer primary key autoincrement,
  cash long,
  change long,
  soldAt datetime default current_timestamp,
  closed boolean default false
);

create table salecheckitem(
  id integer primary key autoincrement,
  saleCheckId int,
  productId int,
  quantity long,
  price long,
  discount long,
  unitId int default -1,
  currencyId int default -1
);
