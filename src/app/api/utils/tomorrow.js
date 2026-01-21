import path from "path";
import SERVER_CONSTANTS from "../constants/apiConstant";
const today = new Date();
today.setDate(today.getDate() + 1);

const year = today.getFullYear();
const month = today.toLocaleDateString("en-US", { month: "long" });
const date = String(today.getDate()).padStart(2, "0");
const formattedDate = today.toLocaleDateString("en-GB").replace(/\//g, "-");
const fileName = `${formattedDate}.xlsx`;

const yearPath = path.join(SERVER_CONSTANTS.FOLDER_PATH, `${year}`);
const monthPath = path.join(yearPath, `${month}`);
const excelPath = path.join(monthPath, fileName);

export { yearPath, monthPath, excelPath };
