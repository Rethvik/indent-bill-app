import logger from "../../utils/log";
import checkOfferAndUpdatePrice from "./utils/checkOfferAndUpdatePrice";
import getPriceList from "./utils/getPriceList";
import getProductPrices from "./utils/getProductPrices";

const getPrices = async (customerID, orderItems) => {
  try {
    let prices;
    // Get pricelist of the customer
    const filter = {
      operator: "eq",
      columnName: "customer_id",
      value: customerID,
    };
    const priceListResult = await getPriceList(customerID, "customers", filter);
    if (priceListResult.success) {
      const priceList = priceListResult.priceList;

      // Get all product ids
      const productIDS = orderItems.map((product) =>
        Number(product.product_id),
      );

      // Get product prices
      const productPriceResult = await getProductPrices(
        productIDS,
        priceList,
        "price_list",
      );
      if (productPriceResult.success) {
        prices = productPriceResult.prices;
        // Check for offers and update prices if offers are applicable
        const updatedPriceswithOffer = await checkOfferAndUpdatePrice(
          orderItems,
          prices,
        );
        return updatedPriceswithOffer;
      } else {
        return productPriceResult;
      }
    } else {
      return priceListResult;
    }
  } catch (e) {
    logger("error", `Error in getting prices ${e.message}`);
  }
};
export default getPrices;
