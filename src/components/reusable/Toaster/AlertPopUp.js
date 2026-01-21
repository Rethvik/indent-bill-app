"use client"
import { Toaster } from 'sonner'
import React from 'react'

function AlertPopUp() {
  return (
    <Toaster 
        position='top-right' 
        richColors
        toastOptions = {
            {
                classNames: 
                    {
                    success: "bg-green-600 text-white",
                    error: "bg-red-600 text-white",
                    warning: "bg-yellow-500 text-black",
                    info: "bg-blue-600 text-white",
                    },
            }
        }
    />
  )
}

export default AlertPopUp