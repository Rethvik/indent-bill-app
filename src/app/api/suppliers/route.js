import { NextResponse } from "next/server";
import getS from "./getCustomers";
// import api from "@/lib/api";

export async function GET(req, res) {
  try {
    const result = await getSuppliers();
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}
