// app/api/auth/check-token/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  return NextResponse.json({
    token: accessToken || null,
  });
}
