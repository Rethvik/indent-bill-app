import { select, insert } from "../../../supabase/supabase";
import logger from "../../../utils/log/index";
export async function getCustomers() {
  try {
    const filters = [
      {
        operator: "eq",
        columnName: "active",
        value: true,
      },
      {
        operator: "order",
        columnName: "customer_id",
        value: { ascending: true },
      },
    ];
    const result = await select("customers", "*", filters);
    if (!result.success) {
      return {
        ...result,
        showMessage: true,
      };
    } else {
      return {
        success: true,
        data: result.data,
        showMessage: true,
        message: "Customers fetched Successfully",
      };
    }
  } catch (error) {
    logger("error", `Error fetching customers: ${error.message}`);
    return {
      success: false,
      error: error,
      message: error.message,
      showMessage: true,
    };
  }
}

export async function getProducts() {
  try {
    const filters = [
      {
        operator: "eq",
        columnName: "active",
        value: true,
      },
    ];
    const result = await select("products", "*", filters);
    return result;
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
    const filters = [
      {
        operator: "order",
        columnName: "supplier_id",
        value: { ascending: true },
      },
    ];
    const result = await select("suppliers", "*", filters);
    return result;
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
    const result = await select("orders", "customer_id", [
      { operator: "eq", columnName: "order_date", value: selectedDate },
    ]);
    return result;
  } catch (err) {
    logger("error", `Error fetching indent: ${err.message}`);
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
    const purchaseResult = await select("purchases", "*", [
      {
        operator: "eq",
        columnName: "purchase_date",
        value: selectedDate,
      },
    ]);
    return purchaseResult;
  } catch (err) {
    logger("error", `Error fetching purchase: ${err.message}`);
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
    const result = await insert(tableName, order);
    if (!result.success) {
      logger(
        "error",
        `Error from supabase in creating new order ${result.message}`,
      );
      return { success: false, showMessage: true, message: result.message };
    }
    return {
      success: true,
      order_number: result.data[0].order_number || result.data[0].purchase_id,
    };
  } catch (err) {
    logger("error", `Error creating order: ${err.message}`);
    return {
      success: false,
      error: err,
      message: err.message,
      showMessage: true,
    };
  }
}

export async function getPriceListLib(data) {
  try {
    const { tableName, filter } = data;
    const priceListResult = await select(tableName, "price_list", [filter]);
    return priceListResult;
  } catch (err) {
    logger("error", `Error while getting price list ${err.message}`);
    return { success: false, message: err.message, showMessage: true };
  }
}
