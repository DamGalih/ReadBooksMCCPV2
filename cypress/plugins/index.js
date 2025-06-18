const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

module.exports = (on, config) => {
  on('task', {
    readExcel() {
      const filePath = path.join(__dirname, '../../bip.xlsx'); // sesuaikan lokasi
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet);
      return jsonData;
    },
  });
};
