import logger from "../utils/log/index";
import { getSuppliers } from "../lib/db";
const getSuppliersInfo = async () => {
  try {
    // const filters = [
    //   {
    //     operator: "order",
    //     columnName: "supplier_id",
    //     value: { ascending: true },
    //   },
    // ];
    const result = await getSuppliers();
    if (!result.success) {
      logger("error", `Error fetching suppliers: ${result.message}`);
      return {
        ...result,
        showMessage: true,
      };
    } else {
      return {
        success: true,
        data: result.data,
        showMessage: true,
        message: "Suppliers fetched Successfully",
      };
    }
  } catch (err) {
    logger("error", `Error fetching suppliers: ${err.message}`);
    return {
      success: false,
      error: err,
      message: err.message,
      showMessage: true,
    };
  }
};
export default getSuppliersInfo;
