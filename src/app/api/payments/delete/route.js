import { NextResponse } from "next/server";
import convertDateToDB from "../../utils/convertDate";
import deletePayment from "./deletePayment";

export async function POST(req) {
  try {
    const body = await req.json();
    const { pdfData, date, customer_id } = body;
    const formattedDate = convertDateToDB(date);
    const result = await deletePayment(pdfData, formattedDate, customer_id);
    return NextResponse.json(result);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, message: err.message, error: err },
      { status: 500 },
    );
  }
}
