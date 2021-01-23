create table staffposition(
  id integer primary key autoincrement,
  title varchar
);

create table staff(
  id integer primary key autoincrement,
  fullName varchar,
  createdAt datetime default current_timestamp,
  lastLoginAt datetime default current_timestamp
);

create table currentinventory(
  id integer primary key autoincrement,
  inventoryId integer default -1,
  productId integer not null,
  productTitle varchar,
  quantity long,
  actualQuantity long,
  diffQuantity long,
  sellPrice long,
  costPrice long,
  unitId integer default -1,
  currencyId integer default -1,
  unique(inventoryId, productId)
);

create table inventory(
  id integer primary key autoincrement,
  responsibleStaffId integer default -1,
  createdAt datetime default current_timestamp,
  closed boolean default false
);

create table inventoryitem(
  id integer primary key autoincrement,
  inventoryId integer,
  productId integer not null,
  productTitle varchar,
  quantity long,
  actualQuantity long,
  diffQuantity long,
  sellPrice long,
  costPrice long,
  unitId integer default -1,
  currencyId integer default -1,
  reason varchar default '',
  payingStaffId integer default -1,
  unique(inventoryId, productId)
);
