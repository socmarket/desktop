insert into importinfo(
  fileDir,
  filePath,
  fileName,
  fields,
  rowCount,
  importedCount,
  unitId,
  categoryId,
  currencyId
) values (
  $fileDir,
  $filePath,
  $fileName,
  $fields,
  $rowCount,
  $importedCount,
  $unitId,
  $categoryId,
  $currencyId
)
