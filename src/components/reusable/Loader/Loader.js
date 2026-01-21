import { Spinner } from '@/components/ui/spinner'
import React from 'react'

function Loader() {
  return (
    // <div className=''>
    //     <Spinner className="size-8 text-green-500"/>
    // </div>
   <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <Spinner className='size-12 text-green-700'/>
   </div>

  )
}

export default Loader