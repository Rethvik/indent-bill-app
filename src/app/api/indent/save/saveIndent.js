import APP_CONSTANT from "@/consts/appConstants";
import getSheetData from "../../utils/getSheetData";
import writeSheetData from "../../utils/writeSheetData";
import logger from "../../utils/log";
import generatePayload from "../utils/generateSwipeInvoicePayload";
import { createInvoice } from "../../swipe";
/***
 Invoice response
 {
  success: true,
  message: 'Invoice created',
  error_code: '',
  errors: [],
  data: {
    hash_id: 'SLQX8Q2tv2glv',
    serial_number: 'INV-2',
    irn: '',
    qr_code: ''
  },
  request_id: '67de790e-c431-424e-9038-d97788e7cf2d',
  timestamp: '2026-01-30 17:12:06.330109'
}
 */
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

        // Called Swipe API to create Invoice
        const invoicePayload = await generatePayload(data.id, data.items, date);
        const invoiceResult = await createInvoice(invoicePayload.payload);

        if (invoiceResult.success) {
          orderData = [...orderData, { id: data.id, ...data.items }];

          const result = await writeSheetData(
            indentFilePath,
            "ORDER",
            orderData,
          );
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
          return {
            success: false,
            message: invoiceResult.message,
            error: invoiceResult,
          };
        }
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
