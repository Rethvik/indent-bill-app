import convertDateToDB from "../../utils/convertDate";
import logger from "../../utils/log";
import createOrder from "./utils/createOrder";
import generateOrderItems from "./utils/generateOrderItems";
import getCustomerIndentToView from "../get/utils/getCustomerIndentToView";
import getPrices from "./getPrices";
import { insert, remove } from "../../supabase/supabase";
import updateIndent from "./utils/updateIndent";

const saveIndent = async (orderInfo, type, date) => {
  try {
    const formattedDate = convertDateToDB(date);
    let prices;
    // If order creation is new
    if (type === "new") {
      const order = {
        customer_id: orderInfo.id,
        order_date: formattedDate,
      };

      // Sending data to create order in order table
      const orderCreationResult = await createOrder(order, "orders");
      if (orderCreationResult.success) {
        logger(
          "success",
          `Order number created successfully for ${orderInfo.customerName}`,
        );
        const orderNumber = orderCreationResult.order_number;

        // Get Prices
        const pricesResult = await getPrices(orderInfo.id, orderInfo.items);

        if (pricesResult.success) {
          prices = pricesResult.prices;

          // Generate order items
          const orderItemsResult = await generateOrderItems(
            orderInfo.items,
            orderNumber,
            prices,
            type,
            true,
          );
          if (orderItemsResult.success) {
            // Insert order items into table
            const result = await insert("order_items", orderItemsResult.data);
            if (result.success) {
              return { success: true, message: "Indent Saved" };
            } else {
              return result;
            }
          } else {
            return orderItemsResult;
          }
        } else {
          return pricesResult;
        }
      } else {
        return orderCreationResult;
      }
    }
    if (type === "edit") {
      // Getting new order items
      const newOrderItems = orderInfo.items;

      // Getting existing order items
      const existingOrderItemsResult = await getCustomerIndentToView(
        date,
        orderInfo.id,
      );
      if (existingOrderItemsResult.success) {
        const existingOrderItems = existingOrderItemsResult.data;

        // Performing operation to seperate removed, updated , newly added items
        const existingMap = new Map(
          existingOrderItems.map((item) => [item.product_id, item]),
        );

        const newMap = new Map(
          newOrderItems.map((item) => [item.product_id, item]),
        );

        const removedItems = existingOrderItems.filter(
          (item) => !newMap.has(item.product_id),
        );

        const addedItems = newOrderItems.filter(
          (item) => !existingMap.has(item.product_id),
        );

        const updatedItems = newOrderItems.filter((item) => {
          const existing = existingMap.get(item.product_id);
          return existing && existing.quantity !== item.quantity;
        });

        // If any items are newly added then we are inserting into order_items
        if (addedItems.length > 0) {
          const pricesResult = await getPrices(orderInfo.id, addedItems);
          if (pricesResult.success) {
            prices = pricesResult.prices;
            const orderItemsResult = await generateOrderItems(
              addedItems,
              existingOrderItemsResult.data[0].order_number,
              prices,
              "new",
              true,
            );
            if (orderItemsResult.success) {
              const result = await insert("order_items", orderItemsResult.data);
              if (!result.success) {
                return result;
              }
            }
          } else {
            return orderItemsResult;
          }
        }

        // If any items are updated
        if (updatedItems.length > 0) {
          const updatedItemsResult = await updateIndent(
            orderInfo.id,
            updatedItems,
            "order_items",
          );
          if (!updatedItemsResult.success) {
            return updatedItemsResult;
          }
        }

        // If any items are removed
        if (removedItems.length > 0) {
          const removedIds = removedItems.map((item) => item.id);
          const deletedItemsResult = await remove("order_items", [
            { operator: "in", columnName: "id", value: removedIds },
          ]);
          if (!deletedItemsResult.success) {
            return deletedItemsResult;
          }
        }
        return { success: true, message: "Indent modified successfully" };
      } else {
        return existingOrderItemsResult;
      }
    }
  } catch (e) {
    logger("error", `Error in save indent file ${e.message}`);
    return { success: false, message: e.message };
  }
};
export default saveIndent;
