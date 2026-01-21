import { checkFile } from "./checkFile";
import * as XLSX from "xlsx";

const writeSheetData = async (filePath, sheetName, data) => {
  try {
    const result = await checkFile(filePath);
    if (result.success) {
      const workbook = XLSX.readFile(filePath);
      let worksheet = workbook.Sheets[sheetName];
      if (worksheet) {
        const newWorksheet = XLSX.utils.json_to_sheet(data);
        workbook.Sheets[sheetName] = newWorksheet;
      } else {
        worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      }
      await XLSX.writeFile(workbook, filePath);
      return { success: true, message: "File Updated" };
    } else {
      return result;
    }
  } catch (err) {
    console.log(`In writeSheetData.js error - ${err}`);
    return { success: false, message: err.message, error: err };
  }
};
export default writeSheetData;
