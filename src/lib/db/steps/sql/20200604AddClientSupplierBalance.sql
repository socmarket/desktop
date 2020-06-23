create table clientbalance(
  id integer primary key autoincrement,
  clientId integer,
  registeredAt datetime default current_timestamp,
  amount long,
  notes varchar(255) default ''
);

create table supplierbalance(
  id integer primary key autoincrement,
  supplierId integer,
  registeredAt datetime default current_timestamp,
  amount long,
  notes varchar(255) default ''
);
