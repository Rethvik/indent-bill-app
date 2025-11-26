import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IndianRupee,BanknoteArrowDown,Landmark,BanknoteArrowUp } from 'lucide-react';
import DatePicker from '@/components/reusable/DatePicker';
const AmountDashboard = () => {
  return (
    <div className='flex justify-between'>
        <div className='flex'>
            <Card className='h-20 py-4 w-45 mr-4'>
                <CardContent>
                    <span className='flex items-center mb-2'>
                        <BanknoteArrowDown color='#5cbc65' size={15}/>
                        <p className='text-green-500 text-sm font-semibold ml-2'>Cash</p>
                    </span>
                    <h3 className="scroll-m-20 text-xl font-medium tracking-tight">
                      <span className='flex items-center'>
                        <IndianRupee size={17}/> 
                        <p>5000</p>
                        </span>
                    </h3>
                </CardContent>
            </Card>
            <Card className='h-20 py-4 w-45 mr-4'>
                <CardContent>
                    <span className='flex items-center mb-2'>
                        <Landmark color='#54aad1' size={15}/>
                        <p className='text-sky-500 text-sm font-semibold ml-2'>UPI</p>
                    </span>
                    <h3 className="scroll-m-20 text-xl font-medium tracking-tight">
                      <span className='flex items-center'>
                        <IndianRupee size={17}/> 
                        <p>5000</p>
                        </span>
                    </h3>
                </CardContent>
            </Card>
            <Card className='h-20 py-4 w-45 mr-4'>
                <CardContent>
                    <span className='flex items-center mb-2'>
                        <BanknoteArrowUp color='#db4545' size={15}/>
                        <p className='text-red-500 text-sm font-semibold ml-2'>Expenses</p>
                    </span>
                    <h3 className="scroll-m-20 text-xl font-medium tracking-tight">
                      <span className='flex items-center'>
                        <IndianRupee size={17}/> 
                        <p>5000</p>
                        </span>
                    </h3>
                </CardContent>
            </Card>
        </div>
            <DatePicker/>
    </div>
  )
}

export default AmountDashboard