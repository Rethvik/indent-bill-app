import { select } from "@/app/api/supabase/supabase";
import logger from "@/app/api/utils/log";

const getProductPrices = async (productIDS, priceList, tableName) => {
  try {
    const filters = [
      {
        operator: "eq",
        columnName: "price_list_id",
        value: priceList,
      },
      {
        operator: "in",
        columnName: "product_id",
        value: productIDS,
      },
    ];
    const pricesResult = await select(
      tableName,
      "product_id, unit_price",
      filters,
    );
    if (!pricesResult.success) {
      logger(
        "error",
        `Error while getting product prices ${pricesResult.message}`,
      );
      return {
        success: false,
        message: pricesResult.message,
        showMessage: true,
      };
    }
    const priceMap = {};
    pricesResult.data.forEach((item) => {
      priceMap[item.product_id] = item.unit_price;
    });
    return { success: true, prices: priceMap };
  } catch (err) {
    logger("error", `Error while getting product prices ${err.message}`);
    return { success: false, showMessage: true, message: err.message };
  }
};
export default getProductPrices;
