import logger from "../utils/log";

const bearerToken = "";
const getListOfCustomers = async () => {
  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${bearerToken}` },
  };
  try {
    const response = await fetch(
      "https://app.getswipe.in/api/partner/v2/customer/list?page=1",
      options,
    );
    const result = await response.json();
    if (result.success) {
      return result;
    } else {
      return { success: false, message: result.message };
    }
  } catch (err) {
    console.log("ERROR IN FETCHING CUSTOMERS SWIPE API", err);
    logger("error", err.message);
    return { success: false, error: err, message: err.message };
  }
};

const getListOfProducts = async () => {
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await fetch(
      "https://app.getswipe.in/api/partner/v2/product/list?page=1",
      options,
    );
    const result = await response.json();
    if (result.success) {
      return result;
    } else {
      return { success: false, message: result.message };
    }
  } catch (err) {
    console.log("ERROR IN FETCHING PRODUCTS SWIPE API", err);
    logger("error", err.message);
    return { success: false, error: err, message: err.message };
  }
};

export { getListOfCustomers, getListOfProducts };
