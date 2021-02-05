import * as XLSX from 'xlsx';

export const parseCSV = (event) => {
  let data = [];
  
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (evt) => {
      // Parsing file data
      const binaryString = evt.target.result;
      const binaryWorksheets = XLSX.read(binaryString, {type: 'binary'});

      // Getting first sheet of the document
      const worksheetName = binaryWorksheets.SheetNames[0];
      const worksheet = binaryWorksheets.Sheets[worksheetName];

      const csvData = XLSX.utils.sheet_to_csv(worksheet, {header: 1});

      // Splitting data and pushing it to array
      const lines = csvData.split(/\r\n|\n/);
      const dataHeaders = lines[0].split(", ");

      for (let i = 1; i < lines.length; i++) {
        const rowData = lines[i].split(", ");
        if (dataHeaders && rowData.length === dataHeaders.length) {
          const rowObj = {};
          for (let j = 0; j < dataHeaders.length; j++) {
            let dataItem = rowData[j];
            if (dataHeaders[j]) {
              rowObj[dataHeaders[j]] = dataItem;
            }
          }
          data.push(rowObj);
        }
      }
    }
    reader.readAsBinaryString(file);
  }
  return data;
}
  