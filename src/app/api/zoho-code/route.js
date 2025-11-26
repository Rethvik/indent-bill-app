import { cookies } from "next/headers";
import { NextRequest,NextResponse } from "next/server";
export async function GET (req,res){
    try{
        const cookiesStore = await cookies();
        const accessToken = cookiesStore.get('accessToken')?.value
        if(accessToken){
            return NextResponse.redirect('http://localhost:3000/customers')
        }
        const paramsData = {
            client_id: process.env.CLIENT_ID,
            response_type:'code',
            redirect_uri:process.env.REDIRECT_URI,
            scope:'ZohoBooks.contacts.ALL',
            access_type:'offline',
            prompt:'consent'
        }
        const params = new URLSearchParams(paramsData)
        const url = `https://accounts.zoho.in/oauth/v2/auth?${params.toString()}`
        return NextResponse.redirect(url)
    }catch(e){
        console.log('Error',e)
    }
};
