import getSheetData from "./getSheetData";
import fileSystem from "fs";
import * as XLSX from "xlsx";

const getMetadata = async (filePath) => {
  try {
    const result = await getSheetData(filePath, "METADATA");
    return result;
  } catch (e) {
    console.log(e);
    return { success: false, message: e.message, error: e };
  }
};

const updateMetaData = async (filePath) => {
  XLSX.set_fs(fileSystem);
  const workbook = XLSX.readFile(filePath);
  const worksheet = XLSX.utils.aoa_to_sheet([
    ["LastUpdated"],
    [{ t: "d", v: new Date() }],
  ]);
  if (workbook.SheetNames.includes("METADATA")) {
    workbook.Sheets["METADATA"] = worksheet;
  } else {
    XLSX.utils.book_append_sheet(workbook, worksheet, "METADATA");
  }
  XLSX.writeFile(workbook, filePath);
};
export { getMetadata, updateMetaData };
