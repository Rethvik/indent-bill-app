import { NextResponse } from "next/server";
import logger from "../utils/log";
import getPurchase from "./utils/getPurchase";
const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const selectedDate = searchParams.get("selectedDate");
    const result = await getPurchase(selectedDate);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (err) {
    logger("error", err.message);
    return NextResponse.json(
      { success: false, message: err.message, showMessage: true },
      { status: 500 },
    );
  }
};
export { GET };
