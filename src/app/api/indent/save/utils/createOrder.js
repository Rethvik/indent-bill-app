import logger from "@/app/api/utils/log";
import { createOrderLib } from "@/app/api/lib/db";
const createOrder = async (order, tableName, date) => {
  try {
    const result = await createOrderLib(order, tableName, date);
    // const result = await insert(tableName, order);
    if (!result.success) {
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
