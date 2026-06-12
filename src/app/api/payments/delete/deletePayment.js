import logger from "../../utils/log";
import supabase from "../../supabase/supabase-client";
import savePaymentPdf from "../save/utils/paymentPdf";

const deletePayment = async (pdfData, date, customer_id) => {
  try {
    const savePDFResult = await savePaymentPdf({ paymentsData: pdfData, date });
    if (!savePDFResult.success) {
      return savePDFResult;
    }
    let { data, error } = await supabase
      .from("payments")
      .delete()
      .eq("payment_date", date)
      .eq("customer_id", customer_id);
    if (error) {
      logger("error", `Error while deleting payment ${error.message}`);
      return { success: false, message: error.message, showMessage: true };
    }
    logger("success", `Payment deleted for customer_id:: ${customer_id}`);
    return {
      success: true,
      message: "Deleted Successfully",
      showMessage: true,
    };
  } catch (err) {
    logger("error", `Error in deletePayment catch block ${err.message}`);
    return { success: false, showMessage: true, message: err.message };
  }
};
export default deletePayment;
