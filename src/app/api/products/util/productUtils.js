import logger from "../../utils/log/index";
import { getProducts } from "../../lib/db";
import sortProductsBasedonDisplayOrder from "./sortProducts";
const getProductsInfo = async () => {
  try {
    const result = await getProducts();
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
export default getProductsInfo;
