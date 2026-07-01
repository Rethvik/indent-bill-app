import { insert } from "@/app/api/supabase/supabase";
import logger from "@/app/api/utils/log";

const createOrder = async (order, tableName) => {
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
  } catch (e) {
    logger("error", `Error while creating new order ${e.message}`);
    return { success: false, message: e.message, showMessage: true };
  }
};
export default createOrder;
