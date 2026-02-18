import logger from "@/app/api/utils/log";

const generateOrderItems = async (orderItems, order_number, prices, type) => {
  try {
    // Generating order items as per supabase schema
    const order_items = orderItems.map((product) => {
      const baseAmount = +parseFloat(
        Number(product.quantity) * prices[String(product.product_id)],
      ).toFixed(2);
      const taxAmount = +parseFloat(
        baseAmount * (product.tax_rate / 100),
      ).toFixed(2);
      const total_amount = +parseFloat(baseAmount + taxAmount).toFixed(2);
      return {
        order_number: order_number,
        product_id: product.product_id,
        name: product.name,
        quantity: Number(product.quantity),
        unit_price: prices[String(product.product_id)],
        tax_rate: product.tax_rate,
        total_amount: total_amount,
      };
    });
    return { success: true, data: order_items };
  } catch (e) {
    logger("error", `Error in catch block of generateOrderItems ${e.message}`);
    return { success: false, message: e.message, showMessage: true };
  }
};

export default generateOrderItems;
