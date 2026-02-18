import SERVER_CONSTANTS from "../../constants/apiConstant";

const sortProductsBasedonDisplayOrder = (data) => {
  const categoryGroupedProducts = Object.groupBy(
    data,
    ({ category }) => category,
  );
  let productsSorted = [];
  // Sorting based on groups and sorting inside groups based on the id
  const config = SERVER_CONSTANTS.PRODUCT_ORDER_CONFIG;
  for (let i = 0; i < config.length; i++) {
    if (
      categoryGroupedProducts[config[i]] &&
      categoryGroupedProducts[config[i]].length > 0
    ) {
      let result = categoryGroupedProducts[config[i]];
      result.sort((a, b) => Number(a.display_order) - Number(b.display_order));
      productsSorted = [...productsSorted, ...result];
    }
  }
  return productsSorted;
};
export default sortProductsBasedonDisplayOrder;
