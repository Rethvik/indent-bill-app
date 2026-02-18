import { select } from "../supabase/supabase";

const getCustomers = async () => {
  try {
    const filters = [
      {
        operator: "eq",
        columnName: "active",
        value: true,
      },
      {
        operator: "order",
        columnName: "customer_id",
        value: { ascending: true },
      },
    ];
    const result = await select("customers", "*", filters);
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
        message: "Customers fetched Successfully",
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
export default getCustomers;
