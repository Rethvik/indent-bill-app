import { select } from "../../supabase/supabase";
import logger from "../../utils/log";
import sortProductsBasedonDisplayOrder from "./sortProducts";
const getProducts = async () => {
  try {
    const result = await select("products", "*", []);
    if (result.success) {
      const productsSorted = sortProductsBasedonDisplayOrder(result.data);
      return {
        success: true,
        message: "Products Fetched",
        data: productsSorted,
        showMessage: true,
      };
    } else {
      return result;
    }
  } catch (err) {
    logger("error", err.message);
    console.log(err);
    return {
      success: false,
      message: err.message,
      error: err,
      showMessage: true,
    };
  }
};
export default getProducts;
