import SERVER_CONSTANTS from "../../constants/apiConstant";
import getSheetData from "../../utils/getSheetData";
import logger from "../../utils/log";
import generateItemsPrice from "./generateItemsPrice";

const generateItemsPayload = async (customerId, indent) => {
  try {
    let itemsPayload = [];
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

        // Create new product object by filtering from product data by indent
        const productsWithIds = Object.keys(indent).map((item) => {
          const productDetail = productsData.filter(
            (product) => product.name === item,
          )[0];
          return {
            id: productDetail.id,
            name: productDetail.name,
            unit: productDetail.unit,
            quantity: Number(indent[item]),
            offer: productDetail.offer,
          };
        });
        for (let i = 0; i < productsWithIds.length; i++) {
          const result = await generateItemsPrice(
            customerId,
            productsWithIds[i],
            priceListOfCustomer,
          );
          if (result.success) {
            itemsPayload = [...itemsPayload, result.data];
          } else {
            return result;
          }
        }
      } else {
        return productsResult;
      }
      return { success: true, data: itemsPayload };
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
