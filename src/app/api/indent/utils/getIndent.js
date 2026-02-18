import getCustomers from "../../customers/getCustomers";
import logger from "../../utils/log";
import convertDateToDB from "../../utils/convertDate";
import { select } from "../../supabase/supabase";
const getIndent = async (indentDate) => {
  try {
    const customersResult = await getCustomers();
    const formattedDate = convertDateToDB(indentDate);
    if (customersResult.success) {
      const result = await select("orders", "customer_id", [
        { operator: "eq", columnName: "order_date", value: formattedDate },
      ]);

      // If the result is not success
      if (!result.success) {
        return { ...result, showMessage: true };
      }

      // Converting customer who order into Ordered status and not ordered into Not Ordered
      const orderedCustomers = result.data.map((item) => item.customer_id);
      const statusOfCustomers = customersResult.data.map((customer) => {
        if (orderedCustomers.includes(customer.customer_id)) {
          return {
            id: customer.customer_id,
            customerName: customer.name,
            status: "Ordered",
            contact: customer.phone,
          };
        } else {
          return {
            id: customer.customer_id,
            customerName: customer.name,
            status: "Not Ordered",
            contact: customer.phone,
          };
        }
      });
      return {
        success: true,
        indent: statusOfCustomers,
        message: "Indent Fetched",
      };
    } else {
      return customersResult;
    }
  } catch (err) {
    logger("error", `Error in getIndent file ${err.message}`);
    return { success: false, message: err.message };
  }
};
export default getIndent;
