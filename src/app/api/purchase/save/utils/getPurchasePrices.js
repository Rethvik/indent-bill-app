import getPriceList from "@/app/api/indent/save/utils/getPriceList";
import getProductPrices from "@/app/api/indent/save/utils/getProductPrices";
import logger from "@/app/api/utils/log";

const getPurchasePrices = async (supplierId, purchaseItems) => {
  try {
    // Get pricelist of the supplier
    const filter = {
      operator: "eq",
      columnName: "supplier_id",
      value: supplierId,
    };
    const priceListResult = await getPriceList(supplierId, "suppliers", filter);
    if (priceListResult.success) {
      const priceList = priceListResult.priceList;

      // Get all product ids
      const productIDS = purchaseItems.map((product) =>
        Number(product.product_id),
      );

      // Get product prices
      const productPriceResult = await getProductPrices(
        productIDS,
        priceList,
        "suppliers_price_list",
      );
      return productPriceResult;
    } else {
      return priceListResult;
    }
  } catch (err) {
    logger("error", `Error in getting purchase prices ${err.message}`);
  }
};
export default getPurchasePrices;
