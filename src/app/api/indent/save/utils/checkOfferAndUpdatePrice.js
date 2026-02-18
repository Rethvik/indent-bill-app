import SERVER_CONSTANTS from "@/app/api/constants/apiConstant";
import getSheetData from "@/app/api/utils/getSheetData";
import logger from "@/app/api/utils/log";

const checkOfferAndUpdatePrice = async (order, prices) => {
  try {
    // Reads offer sheet
    const offerSheetResult = await getSheetData(
      `${SERVER_CONSTANTS.PRODUCTS_FILE_PATH}/prices.xlsx`,
      "OFFERS",
    );
    if (offerSheetResult.success) {
      const offerPrices = offerSheetResult.data;
      let offerPriceMap = {};

      //   Converts offer prices into the offerPrice Object {id: {min_quantity:5, unit_price: 20}}
      offerPrices.forEach((item) => {
        offerPriceMap[item.product_id] = {
          min_quantity: item.min_quantity,
          unit_price: item.unit_price,
        };
      });

      /**
       * Checks if product id contains in offer price mapping.
       * If id is present it checks for min quantity check
       * If it satisfies then updates price object
       */
      order.forEach((item) => {
        if (
          Object.keys(offerPriceMap).includes(String(item.product_id)) &&
          offerPriceMap[String(item.product_id)].min_quantity <= item.quantity
        ) {
          prices[String(item.product_id)] =
            offerPriceMap[String(item.product_id)].unit_price;
        }
      });
      return { success: true, prices };
    } else {
      return offerSheetResult;
    }
  } catch (err) {
    logger("error", err.message);
    return { success: false, message: err.message, showMessage: true };
  }
};
export default checkOfferAndUpdatePrice;
