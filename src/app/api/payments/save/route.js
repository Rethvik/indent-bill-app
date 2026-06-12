import { NextResponse } from "next/server";
import logger from "../../utils/log";
import savePayment from "./savePayment";

const POST = async (req) => {
  try {
    const body = await req.json();
    const { pdfData, date, customer_id, payment_received } = body;
    const result = await savePayment({
      pdfData,
      date,
      customer_id,
      payment_received,
    });
    if (!result.success) {
      logger(
        "error",
        `Failed to save payment for customer_id ${customer_id} due to ${result.message}`,
      );
    }
    logger(
      "success",
      `Payment saved successfully for customer_id ${customer_id} with amount ${payment_received}`,
    );
    return NextResponse.json(result);
  } catch (err) {
    logger("error", `Error in saving payment ${err.message}`);
    return NextResponse.json(
      { success: false, message: err.message, showMessage: true },
      { status: 500 },
    );
  }
};

export { POST };
