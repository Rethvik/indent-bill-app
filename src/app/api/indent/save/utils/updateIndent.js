import { upsert } from "@/app/api/supabase/supabase";
import getPrices from "../getPrices";
import generateOrderItems from "./generateOrderItems";
import logger from "@/app/api/utils/log";
import getPurchasePrices from "@/app/api/purchase/save/utils/getPurchasePrices";

const updateIndent = async (id, items, tableName) => {
  try {
    let pricesResult;
    if (tableName === "order_items") {
      pricesResult = await getPrices(id, items);
    } else {
      pricesResult = await getPurchasePrices(id, items);
    }
    if (pricesResult.success) {
      const prices = pricesResult.prices;
      const orderItemsResult = await generateOrderItems(
        items,
        tableName === "order_items"
          ? items[0].order_number
          : items[0].purchase_id,
        prices,
        "edit",
        tableName === "order_items" ? true : false,
      );
      if (orderItemsResult.success) {
        const updateSupabaseResult = await upsert(
          tableName,
          orderItemsResult.data,
        );
        return updateSupabaseResult;
      } else {
        return orderItemsResult;
      }
    }
  } catch (err) {
    logger("error", `Error in update indent/purchase file ${err.message}`);
    return { success: false, message: err.message };
  }
};
export default updateIndent;
