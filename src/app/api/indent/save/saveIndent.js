import convertDateToDB from "../../utils/convertDate";
import logger from "../../utils/log";
import createOrder from "./utils/createOrder";
import getPriceList from "./utils/getPriceList";
import getProductPrices from "./utils/getProductPrices";
import checkOfferAndUpdatePrice from "./utils/checkOfferAndUpdatePrice";
import generateOrderItems from "./utils/generateOrderItems";
import getCustomerIndentToView from "../get/utils/getCustomerIndentToView";
import getPrices from "./getPrices";
import { insert } from "../../supabase/supabase";
/***
 Invoice response
 {
  success: true,
  message: 'Invoice created',
  error_code: '',
  errors: [],
  data: {
    hash_id: 'SLQX8Q2tv2glv',
    serial_number: 'INV-2',
    irn: '',
    qr_code: ''
  },
  request_id: '67de790e-c431-424e-9038-d97788e7cf2d',
  timestamp: '2026-01-30 17:12:06.330109'
}
 */
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
      const orderCreationResult = await createOrder(order);
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

        if (updatedItems.length > 0) {
          // Get pricelist of the customer
          const priceListResult = await getPriceList(orderInfo.id);

          if (priceListResult.success) {
            const priceList = priceListResult.priceList;

            // Get all product ids
            const productIDS = orderInfo.items.map((product) =>
              Number(product.product_id),
            );

            // Get product prices
            const productPriceResult = await getProductPrices(
              productIDS,
              priceList,
            );
            if (productPriceResult.success) {
              prices = productPriceResult.prices;

              // Check for offers and update prices if offers are applicable
              const updatedPriceswithOffer = await checkOfferAndUpdatePrice(
                orderInfo.items,
                prices,
              );
              if (updatedPriceswithOffer.success) {
                prices = updatedPriceswithOffer.prices;

                // Generate order items into order_items table
                const result = await generateOrderItems(
                  orderInfo.items,
                  orderNumber,
                  prices,
                );
                return result;
              } else {
                return updatedPriceswithOffer;
              }
            } else {
              return productPriceResult;
            }
          }
        } else {
          return priceListResult;
        }
      } else {
        return existingOrderItemsResult;
      }
    }
  } catch (e) {
    logger("error", e);
  }
};
export default saveIndent;
