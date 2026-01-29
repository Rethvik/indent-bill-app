import SERVER_CONSTANTS from "../../constants/apiConstant";
import getSheetData from "../../utils/getSheetData";
import logger from "../../utils/log";

const generateItemsPayload = async (customerId, indent) => {
  try {
    // Get Pricelists information
    const result = await getSheetData(
      `${SERVER_CONSTANTS.CUSTOMER_FILE_PATH}/customers.xlsx`,
      "PRICELIST_TAG",
    );
    if (result.success) {
      const priceLists = result.data;

      //   Get price list of customer
      const priceListOfCustomer = priceLists.filter(
        (item) => Number(item.customer_id) === Number(customerId),
      )[0];

      //  Get products information
      const productsResult = await getSheetData(
        `${SERVER_CONSTANTS.PRODUCTS_FILE_PATH}/products.xlsx`,
        "PRODUCTS",
      );
      if (productsResult.success) {
        const productsData = productsResult.data;
        let productsIds = [];

        // Create new product object by filtering from product data by indent
        const productsWithIds = Object.keys(indent).map((item) => {
          const productDetail = productsData.filter(
            (product) => product.name === item,
          )[0];
          productsIds.push(Number(productDetail.id));
          return {
            id: productDetail.id,
            name: productDetail.name,
            unit: productDetail.unit,
            quantity: Number(indent[item]),
          };
        });

        // Read Item Prices sheet
        const pricesOfProductsResult = await getSheetData(
          `${SERVER_CONSTANTS.PRODUCTS_FILE_PATH}/products.xlsx`,
          "ITEM_PRICES",
        );
        if (pricesOfProductsResult.success) {
          console.log(productsIds);
          const pricesOfProducts = pricesOfProductsResult.data;

          //   Get prices of indent placed products
          const pricesOfPriceList = pricesOfProducts.filter(
            (item) =>
              item.pricelist_id === priceListOfCustomer.pricelist_id &&
              productsIds.includes(Number(item.product_id)),
          );
          console.log(productsWithIds);
          console.log(pricesOfPriceList);
        } else {
          return pricesOfProductsResult;
        }
      } else {
        return productsResult;
      }
    } else {
      return result;
    }
  } catch (err) {
    logger("error", err.message);
    console.log(err);
    return { success: false, message: err.message, error: err };
  }
  return;
};
export default generateItemsPayload;
