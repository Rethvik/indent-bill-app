import * as XLSX from "xlsx";
import { checkFile } from "./checkFile";
import fileSystem from "fs";
const getSheetData = async (filePath, sheetName) => {
  try {
    XLSX.set_fs(fileSystem);
    const result = await checkFile(filePath);
    if (result.success) {
      const workbook = XLSX.readFile(filePath, { cellDates: true });
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      return { success: true, data, workbook };
    } else {
      return { success: false, message: "File Not Found" };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "File Not Found" };
  }
};
export default getSheetData;
