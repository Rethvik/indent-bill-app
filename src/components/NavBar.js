import React from 'react'
import { SidebarTrigger } from './ui/sidebar'

function NavBar() {
  return (
     <nav className="p-2 flex items-center justify-between sticky top-0 bg-background z-10">
        <SidebarTrigger/>
        <p>Hi Manager</p>
     </nav>
  )
}

export default NavBar