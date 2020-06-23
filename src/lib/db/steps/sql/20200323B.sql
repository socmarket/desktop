create table tmpunit(
  id integer,
  title varchar(255),
  notation varchar(10) default ''
);
insert into tmpunit(id, title) select id, title from unit;
drop table unit;
create table unit(
  id integer primary key autoincrement,
  title varchar(255),
  notation varchar(10) default ''
);
insert into unit(id, title, notation) select id, title, notation from tmpunit;
drop table tmpunit;
