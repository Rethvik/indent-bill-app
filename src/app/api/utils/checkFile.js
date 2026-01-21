import fs from "fs/promises";
import * as fileSystem from "fs";
import * as XLSX from "xlsx";
import SERVER_CONSTANTS from "../constants/apiConstant";
import { yearPath, monthPath, excelPath } from "./tomorrow";
const checkFile = async (filePath = "") => {
  if (filePath) {
    try {
      await fs.access(filePath);
      return { success: true, message: "Excel Found" };
    } catch (err) {
      return { success: false, message: err.message, error: err };
    }
  } else {
    // Check main folder
    try {
      await fs.access(SERVER_CONSTANTS.FOLDER_PATH);
    } catch {
      return { success: false, message: "Main Folder Not Found" };
    }

    // Check / create year folder
    try {
      await fs.access(yearPath);
    } catch {
      await fs.mkdir(yearPath, { recursive: true });
    }

    // Check / create month folder
    try {
      await fs.access(monthPath);
    } catch {
      await fs.mkdir(monthPath, { recursive: true });
    }

    //  Check if Excel already exists
    try {
      await fs.access(excelPath);
      return { success: true, message: "Excel Found" };
    } catch {
      // Create new Excel
      // const result = await runPython(['src/python_scripts/util/indent_file.py'])
      const result = await createExcelFile([], "INDENT", excelPath);
      if (result.success) {
        return { success: true, message: "Excel Created", path: excelPath };
      } else {
        return { success: false, message: result.message };
      }
    }
  }
};

const createExcelFile = async (data = [], sheetName, excelPath) => {
  try {
    XLSX.set_fs(fileSystem);
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, excelPath);
    return { success: true, message: "File Creation Success" };
  } catch (e) {
    console.log(e);
    return { success: false, message: e.message };
  }
};

export { checkFile, createExcelFile };
