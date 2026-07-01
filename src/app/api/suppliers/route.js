import { NextResponse } from "next/server";
import getSuppliersInfo from "./getSuppliersInfo";
// import api from "@/lib/api";

export async function GET(req, res) {
  try {
    const result = await getSuppliersInfo();
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}
