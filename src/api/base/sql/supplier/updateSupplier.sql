update supplier set
  name      = $name,
  nameLower = $nameLower,
  contacts  = $contacts,
  notes     = $notes
where id = $id
