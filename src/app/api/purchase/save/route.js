import { NextResponse } from "next/server";
import savePurchase from "./savePurchase";
import logger from "../../utils/log";

const PUT = async (req) => {
  try {
    const body = await req.json();
    let { date, purchaseInfo, type } = body;
    const result = await savePurchase(purchaseInfo, type, date);
    if (result.success) {
      return NextResponse.json({ success: true, message: result.message });
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (err) {
    logger("error", `$Error in save purchase route ${err.message}`);
    return NextResponse.json(
      { success: false, message: err.message, error: err },
      { status: 500 },
    );
  }
};
export { PUT };
