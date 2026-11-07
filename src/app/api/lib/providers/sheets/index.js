import SHEET_CONSTANTS from "@/app/api/constants/sheetsConstant";
import {
  getDriveClient,
  getSheetClient,
} from "@/app/api/google-sheets/getSheetClient";
import { convertToRecord } from "@/app/api/google-sheets/utils/convertToRecord";
import logger from "../../../utils/log/index";
import convertDateToSheet from "../utils/sheets/convertDateToSheets";
import { findFile, findFolder } from "../utils/sheets/findFile";
import SERVER_CONSTANTS from "@/app/api/constants/apiConstant";
import getFileID from "../utils/sheets/getFileID";
import appendRow from "../utils/sheets/appendRowToSheet";
import mapObjectToRow from "../utils/sheets/mapObjectToHeader";
export async function getCustomers() {
  try {
    const sheets = await getSheetClient();
    const customersSheetId = SHEET_CONSTANTS.CUSTOMERS_SHEET.ID;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: customersSheetId,
      range: SHEET_CONSTANTS.CUSTOMERS_SHEET.NAME,
    });
    if (!response.data.values) {
      return {
        success: false,
        message: "No customers found",
        data: [],
        showMessage: true,
      };
    } else {
      const result = convertToRecord(response.data.values);
      if (result.success) {
        return {
          success: true,
          message: "Customers fetched Successfully",
          showMessage: true,
          data: result.records,
        };
      } else {
        return {
          ...result,
          showMessage: true,
        };
      }
    }
  } catch (err) {
    logger("error", `Error fetching customers: ${err.message}`);
    return {
      success: false,
      error: err,
      message: err.message,
      showMessage: true,
    };
  }
}

export async function getProducts() {
  try {
    const sheets = await getSheetClient();
    const productsSheetId = SHEET_CONSTANTS.PRODUCTS_SHEET.ID;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: productsSheetId,
      range: SHEET_CONSTANTS.PRODUCTS_SHEET.NAME,
    });
    if (!response.data.values) {
      return {
        success: false,
        message: "No products found",
        data: [],
        showMessage: true,
      };
    } else {
      const result = convertToRecord(response.data.values);
      if (result.success) {
        return {
          success: true,
          message: "Products fetched Successfully",
          showMessage: true,
          data: result.records,
        };
      } else {
        return {
          ...result,
          showMessage: true,
        };
      }
    }
  } catch (err) {
    logger("error", `Error fetching products: ${err.message}`);
    return {
      success: false,
      error: err,
      message: err.message,
      showMessage: true,
    };
  }
}

export async function getSuppliers() {
  try {
    const sheets = await getSheetClient();
    const suppliersSheetId = SHEET_CONSTANTS.SUPPLIERS_SHEET.ID;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: suppliersSheetId,
      range: SHEET_CONSTANTS.SUPPLIERS_SHEET.NAME,
    });
    if (!response.data.values) {
      return {
        success: false,
        message: "No suppliers found",
        data: [],
        showMessage: true,
      };
    } else {
      const result = convertToRecord(response.data.values);
      if (result.success) {
        return {
          success: true,
          message: "Suppliers fetched Successfully",
          showMessage: true,
          data: result.records,
        };
      } else {
        return {
          ...result,
          showMessage: true,
        };
      }
    }
  } catch (err) {
    logger("error", `Error fetching suppliers: ${err.message}`);
    return {
      success: false,
      error: err,
      message: err.message,
      showMessage: true,
    };
  }
}

export async function getIndent(selectedDate) {
  try {
    const drive = await getDriveClient();
    const fileIdResult = await getFileID(drive, selectedDate);
    if (!fileIdResult.success) {
      return { ...fileIdResult, showMessage: true };
    }
    const sheets = await getSheetClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: fileIdResult.id,
      range: "ORDER",
    });
    const result = convertToRecord(response.data.values);
    if (!result.success) {
      return result;
    }
    return {
      success: true,
      data: result.records,
    };
  } catch (err) {
    logger("error", `Error fetching indent in sheets: ${err.message}`);
    return {
      success: false,
      error: err,
      message: err.message,
      showMessage: true,
    };
  }
}

export async function getPurchase(selectedDate) {
  try {
    const drive = await getDriveClient();
    const fileIdResult = await getFileID(drive, selectedDate);
    if (!fileIdResult.success) {
      return { ...fileIdResult, showMessage: true };
    }
    const sheets = await getSheetClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: fileIdResult.id,
      range: "PURCHASE",
    });
    const result = convertToRecord(response.data.values);
    if (!result.success) {
      return result;
    }
    return {
      success: true,
      data: result.records,
    };
  } catch (err) {
    logger("error", `Error fetching indent in sheets: ${err.message}`);
    return {
      success: false,
      error: err,
      message: err.message,
      showMessage: true,
    };
  }
}

export async function createOrderLib(order, tableName, date) {
  try {
    const drive = await getDriveClient();
    const fileIdResult = await getFileID(drive, date);
    if (!fileIdResult.success) {
      return { ...fileIdResult, showMessage: true };
    }
    const sheets = await getSheetClient();

    // For fetching headers
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: fileIdResult.id,
      range: "ORDER",
    });
    const orderSheet = convertToRecord(response.data.values);

    // Converting object to row based on headers
    const row = mapObjectToRow(orderSheet.headers, order);

    // Converting date to sheet format
    const appendRowResult = await appendRow({
      sheets,
      spreadSheetId: fileIdResult.id,
      sheetName: "ORDER",
      rowValues: row,
    });
    if (!appendRowResult.success) {
      return {
        message: appendRowResult.message,
        success: false,
        showMessage: true,
      };
    }
    return { ...appendRowResult, data: [order] };
  } catch (err) {
    logger("error", `Error creating order in sheets: ${err.message}`);
    return {
      success: false,
      error: err,
      message: err.message,
      showMessage: true,
    };
  }
}

export async function getPriceListLib(data) {
  const customerResult = await getCustomers();
  if (!customerResult.success) {
    return {
      success: false,
      message: customerResult.message,
      showMessage: true,
    };
  }
  const { customerID } = data;
  const customer = customerResult.data.find(
    (cust) => cust.customer_id === customerID,
  );
  return { success: true, data: [customer] };
}
