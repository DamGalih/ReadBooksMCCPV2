const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

module.exports = {
  e2e: {
    setupNodeEvents(on) {
      on('task', {
        readExcel() {
          const filePath = path.join(__dirname, 'bip.xlsx');
          const workbook = xlsx.readFile(filePath);
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = xlsx.utils.sheet_to_json(sheet);
          return jsonData; // [{UUID: 'xxx'}, ...]
        },
      });
    },
  },
};
