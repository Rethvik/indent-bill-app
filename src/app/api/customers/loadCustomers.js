import * as XLSX from "xlsx";
import SERVER_CONSTANTS from "../constants/apiConstant";
import fs from "fs/promises";
import { createExcelFile } from "../utils/checkFile";
import { getMetadata, updateMetaData } from "../utils/metaData";
import fileSystem from "fs";
import logger from "../utils/log";
import { getListOfCustomers } from "../swipe";
const customersData = [
  {
    customer_id: 1,
    name: "Vanapalli 3",
    phone: "1234567890",
    city: "Polavaram",
    balance: 0,
  },
  {
    customer_id: 2,
    name: "Siva",
    phone: "123456678",
    balance: 10000,
    city: "Ubalanka",
  },
  {
    customer_id: 3,
    name: "Yenugu Mahal 2",
    phone: "9878748392",
    balance: -100,
    city: "Mandapalle",
  },
  {
    customer_id: 4,
    name: "Kattunga Srinu",
    phone: "989880988",
    balance: 0,
    city: "Kattunga",
  },
  {
    customer_id: 5,
    name: "D Suri",
    phone: "7878980988",
    balance: 100,
    city: "Devarapalle",
  },
];
const customersFilePath = `${SERVER_CONSTANTS.CUSTOMER_FILE_PATH}/customers.xlsx`;

const customersSWIPEAPI = async () => {
  // CALL CUSTOMER SWIPE API HERE
  // ALL DATA MANIPULATION SHOULD BE DONE HERE
  const customersListResp = await getListOfCustomers();
  if (customersListResp.success) {
    return { success: true, customers: customersListResp.data.customers };
  } else {
    return { success: false, message: customersListResp.message };
  }
};

const checkCustomersFile = async () => {
  try {
    await fs.access(SERVER_CONSTANTS.CUSTOMER_FILE_PATH);
  } catch {
    await fs.mkdir(SERVER_CONSTANTS.CUSTOMER_FILE_PATH, { recursive: true });
  }
  try {
    await fs.access(customersFilePath);
    return { success: true, message: "File Found" };
  } catch {
    const result = await createExcelFile([], "CUSTOMERS", customersFilePath);

    if (result.success) {
      // Here we need to call swipe API and pass this data to loadCustomers
      const customerResult = customersSWIPEAPI();
      if (customerResult.success) {
        await loadCustomers(customerResult.customers);
      } else {
        return customerResult;
      }
      return { success: true, message: "Excel Created" };
    } else {
      return { success: false, message: result.message };
    }
  }
};
// This is to load the customers
const loadCustomers = async (data) => {
  try {
    XLSX.set_fs(fileSystem);
    const workbook = XLSX.readFile(customersFilePath);
    let worksheet;
    if (workbook.SheetNames.includes("CUSTOMERS")) {
      worksheet = workbook.Sheets["CUSTOMERS"];
      const newWorksheet = XLSX.utils.json_to_sheet(data);
      workbook.Sheets["CUSTOMERS"] = newWorksheet;
    } else {
      worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, "CUSTOMERS");
    }
    await XLSX.writeFile(workbook, customersFilePath);
    await updateMetaData(customersFilePath);
    return {
      success: true,
      message: "Customers Fetched Success",
      customers: data,
      showMessage: true,
    };
  } catch (e) {
    console.log(e);
    return { success: false, error: e, message: e.message };
  }
};

//  Gets list of customers
const getCustomers = async () => {
  const result = await checkCustomersFile();
  if (result.success) {
    const metadata = await getMetadata(customersFilePath);
    let lastUpdated;
    if (metadata.data.length > 0) {
      lastUpdated = metadata.data[0]["LastUpdated"];
    } else {
      lastUpdated = 0;
    }
    logger(
      "success",
      `Customer Last Updated At ${new Date(lastUpdated).toLocaleString()}`,
    );
    const currentDate = new Date();
    const diffMs = currentDate - lastUpdated;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    if (hours > SERVER_CONSTANTS.CUSTOMER_TIME_UPDATION) {
      /*
        -> then we need to call the SWIPE API.
        -> After calling SWIPE API, data need to be updated in excel and also last updated information.
      */
      const response = await customersSWIPEAPI();
      if (response.success) {
        const result = await loadCustomers(response.customers);
        return result;
      } else {
        return { ...response, showMessage: true };
      }
    } else {
      const workbook = XLSX.readFile(customersFilePath);
      const worksheet = workbook.Sheets["CUSTOMERS"];
      const existingData = XLSX.utils.sheet_to_json(worksheet);
      return {
        success: true,
        message: "Customers Fetched Successfully",
        customers: existingData,
        showMessage: true,
      };
    }
  } else {
    return { success: false, message: "Customers File Not Present" };
  }
};
export { loadCustomers, getCustomers };
