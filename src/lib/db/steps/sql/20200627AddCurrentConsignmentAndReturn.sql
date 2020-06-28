create table currentconsignment(
  id integer primary key autoincrement,
  productId int,
  quantity long,
  price long,
  unitId int default -1,
  currencyId int default -1,
  unique(productId)
);

-- Quantity was written as is in previous versions
update consignmentitem set quantity = round(quantity * 100);

create table consignmentreturn(
  id integer primary key autoincrement,
  consignmentItemId integer,
  quantity integer,
  returnedAt datetime default current_timestamp,
  notes varchar(255) default ''
);
