import APP_CONSTANT from "@/consts/appConstants";
import getSheetData from "../../utils/getSheetData";
import writeSheetData from "../../utils/writeSheetData";
import logger from "../../utils/log";
import generatePayload from "../utils/generateSwipeInvoicePayload";

const saveIndent = async (indentFilePath, data, type, date) => {
  try {
    const indentSummary = await getSheetData(indentFilePath, "INDENT");
    const totalOrderSummary = await getSheetData(indentFilePath, "ORDER");
    if (indentSummary.success) {
      if (totalOrderSummary.success) {
        let orderData = totalOrderSummary.data;
        orderData = orderData.filter(
          (order) => Number(order.id) !== Number(data.id),
        );

        // Check whether the request came from New indent or edit indent
        // if (type === "edit") {
        //   let prevIndent = totalOrderSummary.data.filter(
        //     (order) => Number(order.id) === Number(data.id),
        //   )[0];
        //   delete prevIndent["id"];
        //   delete prevIndent["__rowNum__"];
        // }
        const invoicePayload = await generatePayload(data.id, data.items, date);
        orderData = [...orderData, { id: data.id, ...data.items }];

        // Here we need to call Swipe API to create invoice, returning those data must be stored in excel
        const result = await writeSheetData(indentFilePath, "ORDER", orderData);
        if (result.success) {
          let customersStatusData = indentSummary.data;
          customersStatusData = customersStatusData.map((detail) => {
            if (detail.id === data.id) {
              detail.status = APP_CONSTANT.ORDERED;
              return detail;
            } else {
              return detail;
            }
          });
          const indentResult = await writeSheetData(
            indentFilePath,
            "INDENT",
            customersStatusData,
          );
          return indentResult;
        }
        return result;
      } else {
        logger("error", totalOrderSummary);
        return totalOrderSummary;
      }
    } else {
      logger("error", indentSummary);
      return indentSummary;
    }
  } catch (e) {
    logger("error", e);
  }
};
export default saveIndent;
