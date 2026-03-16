import { NextResponse, NextRequest } from "next/server";
import getDateFilePath from "../../utils/getDateFilePath";
import saveIndent from "./saveIndent";

export async function PUT(req) {
  try {
    const body = await req.json();
    let { date, orderInfo, type } = body;
    const result = await saveIndent(orderInfo, type, date);
    if (result.success) {
      return NextResponse.json({ success: true, message: result.message });
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, message: err.message, error: err },
      { status: 500 },
    );
  }
}
