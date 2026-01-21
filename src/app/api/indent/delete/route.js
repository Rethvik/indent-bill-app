import { NextResponse } from "next/server";
import getDateFilePath from "../../utils/getDateFilePath";
import deleteIndent from "./deleteIndent";

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const date = searchParams.get("date");
    const indentFilePath = getDateFilePath(date);
    const result = await deleteIndent(indentFilePath, id);
    return NextResponse.json(result);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, message: err.message, error: err },
      { status: 500 },
    );
  }
}
