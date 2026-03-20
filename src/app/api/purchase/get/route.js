import { NextResponse } from "next/server";
import getSupplierPurchaseToView from "./utils/getSupplierPurchaseToView";

export async function GET(req, res) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const date = searchParams.get("date");
    const result = await getSupplierPurchaseToView(date, id);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err,
      message: err.message,
    });
  }
}
