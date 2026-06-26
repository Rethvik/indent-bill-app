import { NextRequest, NextResponse } from "next/server";
import getCustomersInfo from "./getCustomersInfo.js";
// import api from "@/lib/api";

export async function GET(req, res) {
  try {
    // const response = await api.get('https://www.zohoapis.in/books/v3/contacts?organization_id=60058933823')
    // console.log(response.data)
    // Need to write API call from SWIPE to fetch all customers and cusomer_id in loadCustomers File
    // Till then using hardcoded one
    const result = await getCustomersInfo();
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}
