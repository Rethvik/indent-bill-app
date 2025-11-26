'use client'
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { CirclePlay } from 'lucide-react'
import { getCookie } from '@/lib/utils'
function Home() {
  const generateToken = async()=>{
    window.location.href = 'http://localhost:3000/api/zoho-code';
  }
  useEffect(()=>{
    generateToken()
  },[])
  return (
    <>
      <div>This my indent-billing-app</div>
      <Button size='lg' className='rounded-full'><CirclePlay/>Click Me</Button>
    </>

  )
}

export default Home