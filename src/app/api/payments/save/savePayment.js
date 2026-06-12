import convertDateToDB from "../../utils/convertDate";
import logger from "../../utils/log";
import paymentToDb from "./paymentToDb";
import savePaymentPdf from "./utils/paymentPdf";

const savePayment = async ({
  pdfData,
  date,
  customer_id,
  payment_received,
}) => {
  try {
    const formatedDate = convertDateToDB(date);
    const savePDFResult = await savePaymentPdf({
      paymentsData: pdfData,
      date: formatedDate,
    });
    if (!savePDFResult.success) {
      return savePDFResult;
    }
    const paymentToDbResult = await paymentToDb({
      date: formatedDate,
      customer_id,
      payment_received,
    });

    return paymentToDbResult;
  } catch (err) {
    logger("error", `Error in saving payment ${err.message}`);
    return { success: false, message: err.message, showMessage: true };
  }
};
export default savePayment;
