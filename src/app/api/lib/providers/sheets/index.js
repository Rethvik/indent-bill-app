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
