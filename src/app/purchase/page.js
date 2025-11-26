import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react';
import DatePicker from '@/components/reusable/DatePicker'
import React from 'react'

function Purchase() {
  return (
    <section className='my-4 px-2 w-full flex flex-row justify-between'>
        <DatePicker label=''/>
        <Button variant='green'> <Plus />Create Purchase</Button>
    </section>
  )
}

export default Purchase