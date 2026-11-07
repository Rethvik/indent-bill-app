import logger from "@/app/api/utils/log";

import { getPriceListLib } from "@/app/api/lib/db";

const getPriceList = async (customerID, tableName, filter) => {
  try {
    const priceListResult = await getPriceListLib({
      customerID,
      tableName,
      filter,
    });
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
