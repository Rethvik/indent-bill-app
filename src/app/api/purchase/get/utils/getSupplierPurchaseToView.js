import sortProductsBasedonDisplayOrder from "@/app/api/products/util/sortProducts";
import supabase from "@/app/api/supabase/supabase-client";
import convertDateToDB from "@/app/api/utils/convertDate";
import logger from "@/app/api/utils/log";

const getSupplierPurchaseToView = async (date, id) => {
  try {
    const formattedDate = convertDateToDB(date);
    let { data, error } = await supabase
      .from("purchase_items")
      .select(
        `
    name,
    quantity,
    total_amount,
    purchase_id,
    id,
    crates,
    crate_value,
    products!inner (
      unit,
      category,
      display_order,
      product_id,
      tax_rate,
      offer
    ),
    purchases!inner ()
  `,
      )
      .eq("purchases.supplier_id", id)
      .eq("purchases.purchase_date", formattedDate);
    if (error) {
      return { success: false, message: error.message, showMessage: true };
    }
    data = data.map((item) => ({
      id: item.id,
      purchase_id: item.purchase_id,
      product_id: item.products.product_id,
      name: item.name,
      quantity: item.quantity,
      total_amount: item.total_amount,
      unit: item.products.unit,
      category: item.products.category,
      display_order: item.products.display_order,
      tax_rate: item.products.tax_rate,
      offer: item.products.offer,
      crates: item.crates ? item.crates : 0,
      crate_value: item.crate_value ? item.crate_value : 0,
    }));
    data = sortProductsBasedonDisplayOrder(data);
    return { success: true, data };
  } catch (err) {
    logger("error", `Error in getSupplierPurchaseToView: ${err.message}`);
    return { success: false, error: err, message: err.message };
  }
};
export default getSupplierPurchaseToView;
