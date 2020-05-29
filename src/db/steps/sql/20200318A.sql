create table unit(
  id integer primary key autoincrement,
  title varchar(255)
);

alter table product add column unitId int default -1;
