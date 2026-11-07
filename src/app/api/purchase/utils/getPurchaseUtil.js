import getSuppliersInfo from "../../suppliers/getSuppliersInfo";
import isDateInLimit from "../../utils/isDateInLimit";
import { getPurchase } from "../../lib/db";
import convertDateToDB from "../../utils/convertDate";

const getPurchaseUtil = async (purchaseDate) => {
  try {
    const supplierResult = await getSuppliersInfo();
    if (supplierResult.success) {
      const dbDate = convertDateToDB(purchaseDate);
      const purchaseResult = await getPurchase(dbDate);
      if (purchaseResult.success) {
        const selectedDate = new Date(purchaseDate);
        const currentDate = new Date();
        const tomorrowDate = new Date();
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        const isTomorrow =
          selectedDate.toDateString() === tomorrowDate.toDateString();
        const isToday =
          selectedDate.toDateString() === currentDate.toDateString();
        if (purchaseResult.data.length === 0 && !isTomorrow && !isToday) {
          return {
            success: false,
            data: [],
            message: "No purchases on selected date",
          };
        }
        const allowWriteIndent = isDateInLimit(currentDate, selectedDate);
        const purchasedFromSuppliers = purchaseResult.data.map(
          (item) => item.supplier_id,
        );
        const statusOfSuppliers = supplierResult.data.map((supplier) => {
          if (purchasedFromSuppliers.includes(supplier.supplier_id)) {
            return {
              id: supplier.supplier_id,
              supplierName: supplier.supplier_name,
              status: "Purchased",
              allowWriteIndent,
            };
          } else {
            return {
              id: supplier.supplier_id,
              supplierName: supplier.supplier_name,
              status: "Not Purchased",
              allowWriteIndent,
            };
          }
        });
        return {
          success: true,
          data: statusOfSuppliers,
          message: "Purchase Fetched",
        };
      } else {
        return { success: false, message: purchaseResult.message };
      }
    } else {
      return { success: false, message: supplierResult.message };
    }
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export default getPurchaseUtil;
