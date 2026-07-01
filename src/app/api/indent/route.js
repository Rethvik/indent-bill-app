import { NextResponse, NextRequest } from "next/server";
import getIndentFromDB from "./utils/getIndentFromDB";

export async function POST(req) {
  try {
    const body = await req.json();
    let { selectedDate } = body;
    const result = await getIndentFromDB(selectedDate);
    return NextResponse.json(result);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, message: err.message, error: err },
      { status: 500 },
    );
  }
}
