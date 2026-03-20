import { select } from "../supabase/supabase";

const getSuppliers = async () => {
  try {
    const filters = [
      {
        operator: "order",
        columnName: "supplier_id",
        value: { ascending: true },
      },
    ];
    const result = await select("suppliers", "*", filters);
    if (!result.success) {
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
    return {
      success: false,
      error: err,
      message: err.message,
      showMessage: true,
    };
  }
};
export default getSuppliers;
