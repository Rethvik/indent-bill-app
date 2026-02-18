import sortProductsBasedonDisplayOrder from "@/app/api/products/util/sortProducts";
import supabase from "@/app/api/supabase/supabase-client";
import convertDateToDB from "@/app/api/utils/convertDate";

const getCustomerIndentToView = async (date, id) => {
  try {
    const formattedDate = convertDateToDB(date);
    let { data, error } = await supabase
      .from("order_items")
      .select(
        `
    name,
    quantity,
    total_amount,
    order_number,
    id,
    products!inner (
      unit,
      category,
      display_order,
      product_id,
      tax_rate,
      offer
    ),
    orders!inner ()
  `,
      )
      .eq("orders.customer_id", id)
      .eq("orders.order_date", formattedDate);
    if (error) {
      return { success: false, message: error.message, showMessage: true };
    }
    data = data.map((item) => ({
      id: item.id,
      order_number: item.order_number,
      product_id: item.products.product_id,
      name: item.name,
      quantity: item.quantity,
      total_amount: item.total_amount,
      unit: item.products.unit,
      category: item.products.category,
      display_order: item.products.display_order,
      tax_rate: item.products.tax_rate,
      offer: item.products.offer,
    }));
    data = sortProductsBasedonDisplayOrder(data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err, message: err.message };
  }
};
export default getCustomerIndentToView;
