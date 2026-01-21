import { NextResponse, NextRequest } from "next/server";
import getDateFilePath from "../../utils/getDateFilePath";
import saveIndent from "./saveIndent";

export async function PUT(req) {
  try {
    const body = await req.json();
    let { date, data } = body;
    const indentFilePath = getDateFilePath(date);
    const result = await saveIndent(indentFilePath, data);
    if (result.success) {
      return NextResponse.json({ success: true, message: "Indent Saved" });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Something went wrong",
          error: result.message,
        },
        { status: 500 }
      );
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, message: err.message, error: err },
      { status: 500 }
    );
  }
}
