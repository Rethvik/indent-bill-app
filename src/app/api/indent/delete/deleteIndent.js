import supabase from "../../supabase/supabase-client";
import logger from "../../utils/log";

const deleteIndent = async (customerId, date) => {
  try {
    let { data, error } = await supabase
      .from("orders")
      .delete()
      .eq("order_date", date)
      .eq("customer_id", customerId);
    if (error) {
      logger("error", `Error while deleting indent ${error.message}`);
      return { success: false, message: error.message, showMessage: true };
    }
    logger("success", `Indent deleted for customer_id:: ${customerId}`);
    return {
      success: true,
      message: "Deleted Successfully",
      showMessage: true,
    };
  } catch (err) {
    logger("error", `Error in deleteIndent catch block ${err.message}`);
    return { success: false, showMessage: true, message: err.message };
  }
};
export default deleteIndent;
