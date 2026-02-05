import SERVER_CONSTANTS from "../../constants/apiConstant";
import getSheetData from "../../utils/getSheetData";
import logger from "../../utils/log";
const convertToSupportedFormat = (product, productInfo) => {
  const data = {
    id: product.id,
    name: product.name,
    quantity: Number(product.quantity),
    item_type: "Product",
    unit_price: Number(productInfo.price_without_gst),
    price_with_tax: +Number(productInfo.total_price_with_gst).toFixed(2),
    net_amount: +(
      Number(product.quantity) * Number(productInfo.price_without_gst)
    ).toFixed(2),
    total_amount: +(
      Number(product.quantity) * Number(productInfo.total_price_with_gst)
    ).toFixed(2),
    tax_rate: Number(productInfo.gst),
    unit: product.unit,
  };
  return data;
};
const createPayload = async (product, priceListOfCustomer) => {
  const pricesOfProductsResult = await getSheetData(
    `${SERVER_CONSTANTS.PRODUCTS_FILE_PATH}/products.xlsx`,
    "ITEM_PRICES",
  );
  if (pricesOfProductsResult.success) {
    const pricesOfProducts = pricesOfProductsResult.data;

    //   Get prices of indent placed products
    const pricesOfPriceList = pricesOfProducts.filter(
      (item) =>
        Number(item.product_id) === Number(product.id) &&
        item.pricelist_id === priceListOfCustomer.pricelist_id,
    );
    const itemPayload = convertToSupportedFormat(product, pricesOfPriceList[0]);
    return { success: true, data: itemPayload };
  } else {
    return pricesOfProductsResult;
  }
};
const generateItemsPrice = async (customerId, product, priceListOfCustomer) => {
  try {
    // Check if product has offer
    if (product.offer) {
      const offerPricesResult = await getSheetData(
        `${SERVER_CONSTANTS.PRODUCTS_FILE_PATH}/products.xlsx`,
        "OFFER_PRICE",
      );
      if (offerPricesResult.success) {
        const offerPrices = offerPricesResult.data;
        const productOffer = offerPrices.find(
          (item) => Number(item.product_id) === Number(product.id),
        );
        if (Number(product.quantity) >= Number(productOffer.min_quantity)) {
          const data = convertToSupportedFormat(product, productOffer);
          return { success: true, data };
        } else {
          const itemResult = await createPayload(product, priceListOfCustomer);
          return itemResult;
        }
      } else {
        return offerPricesResult;
      }
    } else {
      // Checks if customer has custom prices
      const overRidePricesResult = await getSheetData(
        `${SERVER_CONSTANTS.PRODUCTS_FILE_PATH}/products.xlsx`,
        "OVERRIDE_PRICE",
      );
      if (overRidePricesResult.success) {
        const overRidePrices = overRidePricesResult.data;
        const customerCustomPrices = overRidePrices.filter(
          (item) =>
            Number(item.customer_id) === Number(customerId) &&
            Number(item.product_id) === Number(product.id),
        );
        if (customerCustomPrices.length > 0) {
          const data = convertToSupportedFormat(
            product,
            customerCustomPrices[0],
          );
          return { success: true, data };
        }
      } else {
        return overRidePricesResult;
      }
      return createPayload(product, priceListOfCustomer);
    }
  } catch (err) {
    logger("error", err.message);
    console.log(err);
    return { success: false, error: err, message: err.message };
  }
};
export default generateItemsPrice;
