"use client"
import DataTable from '@/components/reusable/DataTable/DataTable';
import { Plus } from 'lucide-react';
import React, { useEffect } from 'react'
import customersData from './data/customersData';
import columns from './data/columns';

function Customers() {
  const fetchCustomers = async ()=>{
    const response = await fetch('http://localhost:3000/api/customers')
  }

  useEffect(()=>{
    fetchCustomers()
  },[])
  return (
    <main className='mt-3'>
        <div className='my-2 px-4 py-2 bg-secondary rounded-md'>
          <h1 className='font-semibold'>Customers</h1>
        </div>
        <section>
            <DataTable filter={{searchPlaceholder:'customers',filterColumn:'customerName'}} data={customersData} columns={columns}/>
        </section>
    </main>
  )
}

export default Customers;