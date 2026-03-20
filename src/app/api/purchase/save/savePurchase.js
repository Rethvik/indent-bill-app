import createOrder from "../../indent/save/utils/createOrder";
import generateOrderItems from "../../indent/save/utils/generateOrderItems";
import updateIndent from "../../indent/save/utils/updateIndent";
import { insert, remove } from "../../supabase/supabase";
import convertDateToDB from "../../utils/convertDate";
import logger from "../../utils/log";
import getSupplierPurchaseToView from "../get/utils/getSupplierPurchaseToView";
import getPurchasePrices from "./utils/getPurchasePrices";

const savePurchase = async (purchaseInfo, type, date) => {
  try {
    const formattedDate = convertDateToDB(date);

    if (type === "new") {
      const order = {
        supplier_id: purchaseInfo.id,
        purchase_date: formattedDate,
      };

      // Sending data to create order in purchases table
      const orderCreationResult = await createOrder(order, "purchases");
      if (orderCreationResult.success) {
        logger(
          "success",
          `Purchase number created successfully for ${purchaseInfo.supplierName}`,
        );
        const purchaseNumber = orderCreationResult.order_number;

        // Get Prices
        const pricesResult = await getPurchasePrices(
          purchaseInfo.id,
          purchaseInfo.items,
        );
        if (pricesResult.success) {
          let prices = pricesResult.prices;
          const purchaseItemsResult = await generateOrderItems(
            purchaseInfo.items,
            purchaseNumber,
            prices,
            type,
            false,
          );
          if (purchaseItemsResult.success) {
            // Insert order items into table
            const result = await insert(
              "purchase_items",
              purchaseItemsResult.data,
            );
            if (result.success) {
              return { success: true, message: "Purchase Saved" };
            } else {
              return result;
            }
          } else {
            return purchaseItemsResult;
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
      const newPurchaseItems = purchaseInfo.items;

      // Getting existing order items
      const existingPurchaseItemsResult = await getSupplierPurchaseToView(
        date,
        purchaseInfo.id,
      );
      if (existingPurchaseItemsResult.success) {
        const existingPurchaseItems = existingPurchaseItemsResult.data;
        // Performing operation to seperate removed, updated , newly added items
        const existingMap = new Map(
          existingPurchaseItems.map((item) => [item.product_id, item]),
        );

        const newMap = new Map(
          newPurchaseItems.map((item) => [item.product_id, item]),
        );

        const removedItems = existingPurchaseItems.filter(
          (item) => !newMap.has(item.product_id),
        );

        const addedItems = newPurchaseItems.filter(
          (item) => !existingMap.has(item.product_id),
        );

        const updatedItems = newPurchaseItems.filter((item) => {
          const existing = existingMap.get(item.product_id);
          return existing && existing.quantity !== item.quantity;
        });

        if (addedItems.length > 0) {
          const pricesResult = await getPurchasePrices(
            purchaseInfo.id,
            addedItems,
          );
          if (pricesResult.success) {
            const prices = pricesResult.prices;
            const purchaseItemsResult = await generateOrderItems(
              addedItems,
              existingPurchaseItemsResult.data[0].purchase_id,
              prices,
              "new",
              false,
            );
            if (purchaseItemsResult.success) {
              const result = await insert(
                "purchase_items",
                purchaseItemsResult.data,
              );
              if (!result.success) {
                return result;
              }
            }
          } else {
            return purchaseItemsResult;
          }
        }

        // If any items are updated
        if (updatedItems.length > 0) {
          const updatedItemsResult = await updateIndent(
            purchaseInfo.id,
            updatedItems,
            "purchase_items",
          );
          if (!updatedItemsResult.success) {
            return updatedItemsResult;
          }
        }
        // If any items are removed
        if (removedItems.length > 0) {
          const removedIds = removedItems.map((item) => item.id);
          const deletedItemsResult = await remove("purchase_items", [
            { operator: "in", columnName: "id", value: removedIds },
          ]);
          if (!deletedItemsResult.success) {
            return deletedItemsResult;
          }
        }
        return { success: true, message: "Purchase modified successfully" };
      } else {
        return existingPurchaseItemsResult;
      }
    }
  } catch (err) {
    logger("error", `Error in save purchase file ${err.message}`);
    return { success: false, message: err.message, error: err };
  }
};
export default savePurchase;
