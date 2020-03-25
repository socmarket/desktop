create table client(
  id integer primary key autoincrement,
  name varchar(255),
  contacts varchar(500),
  notes varchar(255)
);

create table supplier(
  id integer primary key autoincrement,
  name varchar(255),
  contacts varchar(500),
  notes varchar(255)
);
