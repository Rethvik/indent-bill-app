"use client"

import { IndianRupee,User,Smartphone,MapPin,ReceiptIndianRupee } from "lucide-react";

const { Badge } = require("@/components/ui/badge");

const columns = [
    {
        accessorKey:'id',
        header:'ID'
    },
    {
        accessorKey:'customerName',
        header:()=><div className="flex items-center"><User className='mr-1' size={15}/>Customer</div>
    },
    {
        accessorKey:'phone',
        header:()=><div className="flex items-center"><Smartphone className='mr-1' size={15}/>Contact No</div>
    },
    {
        accessorKey:'city',
        header:()=><div className="flex items-center"><MapPin className='mr-1' size={15}/>Address</div>
    },
    {
        accessorKey:'balance',
        header:()=><div className="flex items-center"><ReceiptIndianRupee className='mr-1' size={15}/>Balance</div>,
        cell:({row})=>(
            <div className="flex">
                <Badge variant={row.getValue("balance")>0?'redoutline':'emerald'}><IndianRupee />{row.getValue("balance")}</Badge>
            </div>
        )
    }
]
export default columns;