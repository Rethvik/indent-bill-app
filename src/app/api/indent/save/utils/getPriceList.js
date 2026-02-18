import logger from "@/app/api/utils/log";

import { select } from "@/app/api/supabase/supabase";

const getPriceList = async (id) => {
  try {
    const priceListResult = await select("customers", "price_list", [
      { operator: "eq", columnName: "customer_id", value: id },
    ]);
    if (!priceListResult.success) {
      logger(
        "error",
        `Error while getting price list ${priceListResult.message}`,
      );
      return {
        success: false,
        message: priceListResult.message,
        showMessage: true,
      };
    }
    const priceList = priceListResult.data[0].price_list;
    return { success: true, priceList };
  } catch (err) {
    logger("error", `Error while getting price list ${err.message}`);
    return { success: false, message: err.message, showMessage: true };
  }
};
export default getPriceList;
