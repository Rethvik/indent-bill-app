import React from 'react'
import DataTable from '@/components/reusable/DataTable/DataTable';
import inventoryData from '@/app/inventory/data/dataTableData';
import columns from '@/app/inventory/data/columns';
function Inventory() {
  return (
    <main>
        <section>
            <div className='my-2 px-4 py-2 bg-secondary rounded-md'>
                <h1 className='font-semibold'>Inventory</h1>
            </div>
            <DataTable filter={{searchPlaceholder:'products',filterColumn:'productTitle'}} data={inventoryData} columns={columns}/>
        </section>
    </main>
  )
}

export default Inventory