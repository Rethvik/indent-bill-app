import supabase from "../supabase/supabase-client";
import convertDateToDB from "../utils/convertDate";
import logger from "../utils/log";
import savePaymentPdf from "./save/utils/paymentPdf";

const getPaymentData = async (date) => {
  try {
    const formattedDate = convertDateToDB(date);
    const [customersRes, ordersRes, paymentsRes] = await Promise.all([
      // Query 1 — all customers
      supabase.from("customers").select("customer_id, name").eq("active", true),

      // Query 2 — bill amounts
      supabase
        .from("orders")
        .select("customers(customer_id), order_items(total_amount)")
        .eq("order_date", formattedDate),

      // Query 3 — payments received
      supabase
        .from("payments")
        .select("customer_id, payment_received, created_at")
        .eq("payment_date", formattedDate),
    ]);
    if (customersRes.error) {
      logger(
        "error",
        `Failed to fetch customers: ${customersRes.error.message}`,
      );
      return {
        success: false,
        data: null,
        message: customersRes.error.message,
      };
    }
    if (ordersRes.error) {
      logger("error", `Failed to fetch orders: ${ordersRes.error.message}`);
      return { success: false, data: null, message: ordersRes.error.message };
    }
    if (paymentsRes.error) {
      logger("error", `Failed to fetch payments: ${paymentsRes.error.message}`);
      return { success: false, data: null, message: paymentsRes.error.message };
    }
    const orderTotals = {};
    ordersRes.data?.forEach((order) => {
      if (!order.customers) return;
      const customer_id = order.customers.customer_id;
      const orderTotal =
        order.order_items?.reduce(
          (sum, item) => sum + (item.total_amount || 0),
          0,
        ) ?? 0;
      orderTotals[customer_id] = (orderTotals[customer_id] || 0) + orderTotal;
    });

    // ── Build payment totals map ────────────────
    const paymentTotals = {};
    paymentsRes.data?.forEach((p) => {
      paymentTotals[p.customer_id] = {
        amount: (paymentTotals[p.customer_id] || 0) + (p.payment_received ?? 0),
        createdAt:
          new Date(p.created_at).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }) ?? null,
      };
    });
    const getSortPriority = (c) => {
      const hasBill = c.totalAmount > 0;
      const hasPayment = c.paymentReceived > 0;

      if (hasBill && hasPayment) return 1; // has both
      if (!hasBill && hasPayment) return 2; // only payment
      if (hasBill && !hasPayment) return 3; // bill but no payment
      return 4; // nothing
    };
    const data = customersRes.data
      .map((c) => ({
        customer_id: c.customer_id,
        name: c.name,
        totalAmount: Math.round(orderTotals[c.customer_id] || 0),
        paymentReceived: Math.round(paymentTotals[c.customer_id]?.amount || 0),
        paymentCreatedAt: paymentTotals[c.customer_id]?.createdAt ?? null,
      }))
      .sort((a, b) => getSortPriority(a) - getSortPriority(b));
    const result = savePaymentPdf({ paymentsData: data, date: formattedDate });
    return {
      success: true,
      data,
      message: "Payments fetched successfully!",
    };
  } catch (err) {
    logger("error", `Error in getPaymentData: ${err.message}`);
    return { success: false, error: err, message: err.message };
  }
};
export default getPaymentData;
