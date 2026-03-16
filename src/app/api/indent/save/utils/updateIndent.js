import { upsert } from "@/app/api/supabase/supabase";
import getPrices from "../getPrices";
import generateOrderItems from "./generateOrderItems";
import logger from "@/app/api/utils/log";

const updateIndent = async (customer_id, items) => {
  try {
    const pricesResult = await getPrices(customer_id, items);
    if (pricesResult.success) {
      const prices = pricesResult.prices;
      const orderItemsResult = await generateOrderItems(
        items,
        items[0].order_number,
        prices,
        "edit",
      );
      if (orderItemsResult.success) {
        const updateSupabaseResult = await upsert(
          "order_items",
          orderItemsResult.data,
        );
        return updateSupabaseResult;
      } else {
        return orderItemsResult;
      }
    }
  } catch (err) {
    logger("error", `Error in update indent file ${err.message}`);
    return { success: false, message: err.message };
  }
};
export default updateIndent;
