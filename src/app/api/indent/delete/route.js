import { NextResponse } from "next/server";
import deleteIndent from "./deleteIndent";
import convertDateToDB from "../../utils/convertDate";

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const date = searchParams.get("date");
    const formattedDate = convertDateToDB(date);
    const result = await deleteIndent(id, formattedDate);
    return NextResponse.json(result);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, message: err.message, error: err },
      { status: 500 },
    );
  }
}
