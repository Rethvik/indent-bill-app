import SHEET_CONSTANTS from "@/app/api/constants/sheetsConstant";
import { getSheetClient } from "@/app/api/google-sheets/getSheetClient";
import { convertToRecord } from "@/app/api/google-sheets/utils/convertToRecord";
import logger from "../../../utils/log/index";
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
