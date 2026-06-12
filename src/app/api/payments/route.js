import { NextResponse } from "next/server";
import logger from "../utils/log";
import getPaymentData from "./getPayments";

const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const selectedDate = searchParams.get("selectedDate");
    const result = await getPaymentData(selectedDate);
    return NextResponse.json(result);
  } catch (err) {
    logger("error", err.message);
    return NextResponse.json(
      { success: false, message: err.message, showMessage: true },
      { status: 500 },
    );
  }
};

export { GET };
