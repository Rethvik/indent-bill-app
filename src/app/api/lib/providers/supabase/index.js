import { select } from "../../../supabase/supabase";
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
