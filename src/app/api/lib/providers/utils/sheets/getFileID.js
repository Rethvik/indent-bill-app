import SERVER_CONSTANTS from "@/app/api/constants/apiConstant";
import SHEET_CONSTANTS from "@/app/api/constants/sheetsConstant";
import { findFile, findFolder } from "./findFile";
import convertDateToSheet from "./convertDateToSheets";

const getFileID = async (drive, selectedDate) => {
  const sheetFileDate = convertDateToSheet(selectedDate);
  const [year, month, date] = selectedDate.split("-");
  const monthName = SERVER_CONSTANTS.MONTHS[month];
  const monthFolderName = `${month}-${monthName}`;
  const rootFolderId = SHEET_CONSTANTS.DRIVE_ROOT_FOLDER_ID;
  const yearFolderResult = await findFolder(drive, year, rootFolderId);
  if (!yearFolderResult.id || !yearFolderResult.success) {
    return {
      success: false,
      message: `Year folder for ${year} not found`,
      showMessage: true,
    };
  }
  const monthFolderResult = await findFolder(
    drive,
    monthFolderName,
    yearFolderResult.id,
  );
  if (!monthFolderResult.id || !monthFolderResult.success) {
    return {
      success: false,
      message: `Month folder for ${monthFolderName} not found`,
      showMessage: true,
    };
  }
  const fileId = await findFile(drive, sheetFileDate, monthFolderResult.id);
  if (!fileId.id || !fileId.success) {
    return {
      success: false,
      message: `File for ${sheetFileDate} not found`,
      showMessage: true,
    };
  }
  return {
    success: true,
    id: fileId.id,
  };
};

export default getFileID;
