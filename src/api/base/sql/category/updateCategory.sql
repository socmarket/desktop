update category set
  title      = $title,
  titleLower = $titleLower,
  notes      = $notes
where id = $id
