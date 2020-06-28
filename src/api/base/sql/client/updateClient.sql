update client set
  name      = $name,
  nameLower = $nameLower,
  contacts  = $contacts,
  notes     = $notes
where id = $id
