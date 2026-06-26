import { getCustomers } from "../lib/db.js";
const getCustomersInfo = async () => {
  try {
    const result = await getCustomers();
    return result;
  } catch (err) {
    return {
      success: false,
      error: err,
      message: err.message,
      showMessage: true,
    };
  }
};
export default getCustomersInfo;
