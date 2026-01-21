import path from "path";
import SERVER_CONSTANTS from "../constants/apiConstant";

const getDateFilePath = (selectedDate) => {
  const date = new Date(selectedDate);
  const year = date.getFullYear();
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const formattedDate = date.toLocaleDateString("en-GB").replace(/\//g, "-");
  const fileName = `${formattedDate}.xlsx`;
  const yearPath = path.join(SERVER_CONSTANTS.FOLDER_PATH, `${year}`);
  const monthPath = path.join(yearPath, `${month}`);
  const excelPath = path.join(monthPath, fileName);
  return excelPath;
};
export default getDateFilePath;
