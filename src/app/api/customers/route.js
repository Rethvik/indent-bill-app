import { NextRequest,NextResponse } from "next/server";
import api from "@/lib/api";
export async function GET (req,res){
    try{
        const response = await api.get('https://www.zohoapis.in/books/v3/contacts?organization_id=60058933823')
        console.log(response.data)
        return NextResponse.json({message:'Hi From Customers'})
    }catch(e){
        return NextResponse.json({'error':e})
    }
};
