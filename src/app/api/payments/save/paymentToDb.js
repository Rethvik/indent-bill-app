import { upsert } from "../../supabase/supabase";

const paymentToDb = async ({ date, customer_id, payment_received }) => {
  const data = [
    {
      customer_id,
      payment_date: date,
      payment_received,
      created_at: new Date(),
    },
  ];
  const result = await upsert("payments", data, "customer_id, payment_date");
  return { ...result, showMessage: true };
};
export default paymentToDb;
