import { NextResponse } from "next/server";
import { cookies } from "next/headers";
export const POST = async(req)=>{
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }
    const paramsData = new URLSearchParams({
        grant_type:'refresh_token',
        client_id: process.env.CLIENT_ID,
        client_secret:process.env.CLIENT_SECRET,
        refresh_token:refreshToken
    })
    const response = await fetch(`https://accounts.zoho.com/oauth/v2/token?${paramsData.toString()}`,{
        method:'POST',
        headers:{
            "Content-Type": "application/data" 
        }
    });
    const data = await response.json();
    const res = NextResponse.json({ success: true });
    res.cookies.set("accessToken", data.access_token, { httpOnly: true });
    res.cookies.set("expiresAt", Date.now() + data.expires_in * 1000, { httpOnly: true });

    return res;

}