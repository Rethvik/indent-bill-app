import SERVER_CONSTANTS from "../../constants/apiConstant";
import getSheetData from "../../utils/getSheetData";
import logger from "../../utils/log";
import generateItemsPayload from "./generateSwipeItemsPayload";

const generatePayload = async (customerId, indent, selectedDate) => {
  try {
    const date = new Date(selectedDate);
    const formattedDate = date.toLocaleDateString("en-GB").replace(/\//g, "-");
    let payload = {
      documentType: "invoice",
      documentDate: formattedDate,
    };
    const customersResult = await getSheetData(
      `${SERVER_CONSTANTS.CUSTOMER_FILE_PATH}/customers.xlsx`,
      "CUSTOMERS",
    );
    if (customersResult.success) {
      const customers = customersResult.data;
      const customerData = customers.filter(
        (item) => Number(item.customer_id) === Number(customerId),
      );
      const customer = customerData[0];
      payload = {
        ...payload,
        party: {
          id: customer.customer_id,
          type: "customer",
          name: customer.name,
          phone_number: customer.phone,
          gstin: customer.gstin,
        },
      };
      //   console.log(payload);
      const itemsPayload = await generateItemsPayload(customerId, indent);
    } else {
      return { success: false, message: customersResult.message };
    }
    return;
  } catch (err) {
    logger("error", err.message);
    console.log(err);
    return { success: false, message: err.message, error: err };
  }
};
export default generatePayload;
