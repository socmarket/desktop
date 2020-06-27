insert into settings(key, value)
values($key, $value)
on conflict(key) do update set value=$value
