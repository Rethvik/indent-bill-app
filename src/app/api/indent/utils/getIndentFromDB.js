import getCustomers from "../../customers/getCustomersInfo";
import logger from "../../utils/log";
import convertDateToDB from "../../utils/convertDate";
import { getIndent } from "../../lib/db";
import isDateInLimit from "../../utils/isDateInLimit";
const getIndentFromDB = async (indentDate) => {
  try {
    const customersResult = await getCustomers();
    if (customersResult.success) {
      const formattedDate = convertDateToDB(indentDate);
      const result = await getIndent(formattedDate);

      // If the result is not success
      if (!result.success) {
        return { ...result, showMessage: true };
      }
      const selectedDate = new Date(indentDate);
      const currentDate = new Date();
      const tomorrowDate = new Date();
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      const isTomorrow =
        selectedDate.toDateString() === tomorrowDate.toDateString();
      const isToday =
        selectedDate.toDateString() === currentDate.toDateString();

      // If there is no indent on the selected date and the selected date is not today or tomorrow then show message no indent on selected date
      if (result.data.length === 0 && !isTomorrow && !isToday) {
        return {
          success: false,
          indent: [],
          message: "No indent on selected date",
        };
      }

      // To check whether the indent can be written or not, the date should be either current date or tomorrow's date
      const allowWriteIndent = isDateInLimit(currentDate, selectedDate);

      // Converting customer who order into Ordered status and not ordered into Not Ordered
      const orderedCustomers = result.data.map((item) => item.customer_id);
      const statusOfCustomers = customersResult.data.map((customer) => {
        if (orderedCustomers.includes(customer.customer_id)) {
          return {
            id: customer.customer_id,
            customerName: customer.name,
            status: "Ordered",
            contact: customer.phone,
            allowWriteIndent,
          };
        } else {
          return {
            id: customer.customer_id,
            customerName: customer.name,
            status: "Not Ordered",
            contact: customer.phone,
            allowWriteIndent,
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
    logger("error", `Error in getIndentFromDB file ${err.message}`);
    console.log(err);
    return { success: false, message: err.message };
  }
};
export default getIndentFromDB;
