import { NextResponse } from "next/server";
import convertDateToDB from "../../utils/convertDate";
import deletePurchase from "./deletePurchase";

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const date = searchParams.get("date");
    const formattedDate = convertDateToDB(date);
    const result = await deletePurchase(id, formattedDate);
    return NextResponse.json(result);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, message: err.message, error: err },
      { status: 500 },
    );
  }
}
