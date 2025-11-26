import axios from "axios";
import { cookies } from "next/headers";
const api = axios.create({
    baseURL:process.env.BASE_URL,
    withCredentials:true
});
api.interceptors.request.use(async(config)=>{
    const cookieStore = await cookies();
    let accessToken = cookieStore.get('accessToken')?.value;
    const expiresAt = cookieStore.get('expiresAt')?.value;

    const isExpired = Date.now() > Number(expiresAt);
    if(isExpired){
      await fetch("http://localhost:3000/api/token/refresh",{method:'POST',credentials:"include"});
    }
    accessToken = cookieStore.get('accessToken')?.value;
    if (accessToken) {
        config.headers.Authorization = `Zoho-oauthtoken ${accessToken}`;
    }

    return config;
});
export default api;