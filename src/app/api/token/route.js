import { cookies } from "next/headers";

const { NextResponse } = require("next/server");

export const GET = async (req,res)=>{
    try{
        const code = req.nextUrl.searchParams.get("code");
        if(!code){
            return NextResponse.json({error:'Code not found'},{status:400});
        }
        const paramsData = {
            redirect_uri : process.env.REDIRECT_URI,
            client_id : process.env.CLIENT_ID,
            client_secret : process.env.CLIENT_SECRET,
            grant_type : "authorization_code",
            code:code
        }
        const params = new URLSearchParams(paramsData);
        const url = `https://accounts.zoho.in/oauth/v2/token?${params.toString()}`;
        const response = await fetch(url,{
            method:'POST',
            headers:{"Content-Type":'application/data'},
        })
        const result = await response.json()
        const cookieStore = await cookies()
        const cookieConfig = {httpOnly: true,secure: true,path: "/"}
        cookieStore.set("accessToken",result.access_token,cookieConfig);
        cookieStore.set("refreshToken",result.refresh_token,cookieConfig);
        cookieStore.set("expiresAt", Date.now() + result.expires_in * 1000,cookieConfig);
        console.log(result)
        return NextResponse.redirect("http://localhost:3000/customers");

    }catch(e){
        console.log(e)
    }
}
