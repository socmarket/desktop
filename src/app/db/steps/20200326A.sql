create table role(
  id integer primary key autoincrement,
  name varchar(255),
  title varchar(255),
  notes varchar(500),
  unique(name)
);

create table user(
  id integer primary key autoincrement,
  login varchar(255),
  fullName varchar(255),
  password varchar(500) default null,
  unique(login)
);

create table session(
  id integer primary key autoincrement,
  userId integer,
  startedAt datetime default current_timestamp,
  endedAt datetime default null
);

create table userrole(
  userId integer,
  roleId integer,
  unique(userId, roleId)
);

insert into user(login, fullName, password) values('admin', '', null);
