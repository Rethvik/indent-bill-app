import supabase from "../../supabase/supabase-client";
import logger from "../../utils/log";

const deletePurchase = async (supplierId, date) => {
  try {
    let { data, error } = await supabase
      .from("purchases")
      .delete()
      .eq("purchase_date", date)
      .eq("supplier_id", supplierId);
    if (error) {
      logger("error", `Error while deleting purchase ${error.message}`);
      return { success: false, message: error.message, showMessage: true };
    }
    logger("success", `Purchase deleted for supplier_id:: ${supplierId}`);
    return {
      success: true,
      message: "Deleted Successfully",
      showMessage: true,
    };
  } catch (err) {
    logger("error", `Error in deletePurchase catch block ${err.message}`);
    return { success: false, showMessage: true, message: err.message };
  }
};
export default deletePurchase;
