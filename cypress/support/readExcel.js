const xlsx = require('xlsx');
const path = require('path');

function readExcelData(filename, sheetName = 'Buku') {
  const filePath = path.resolve(__dirname, '..', '..', filename);
  const workbook = xlsx.readFile(filePath);
  const worksheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(worksheet);
}

module.exports = { readExcelData };
