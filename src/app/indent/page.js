"use client"
import DataTable from '@/components/reusable/DataTable/DataTable'
import React, { useState } from 'react'
import columns from './data/columns'
import indentData from './data/indentData'
import actionButtons from './actionButtons'
import { Modal } from '@/components/reusable/Dialog/Modal'
import ViewIndent from './components/Dialogs/ViewIndent'
import SideSheet from '@/components/reusable/Sheet/SideSheet'
import NewIndent from './components/Indent/NewIndent'

function Indent() {
    const [showDeleteDialog,setShowDeleteDialog] = useState(false);
    const [showViewDialog,setShowViewDialog] = useState(false);
    const [showSideSheet,setShowSideSheet] = useState(false);
    const [rowData,setRowData] = useState({})
    const deleteDialogHandler = ()=>{
        setShowDeleteDialog(prev=>!prev)
    }
    const viewDialogHandler = (row)=>{
        setRowData(row)
        setShowViewDialog(prev=>!prev)
    }
    const sideSheetHandler = (row)=>{
        setRowData(row)
        setShowSideSheet(prev=>!prev)
    }
  return (
    <>
    {showDeleteDialog&&<Modal dialogData={{title:'Delete Confirmation',desc:'Are you sure, you want to delete',cancelButtonTitle:'Yes',okButtonTitle:'No'}} open={showDeleteDialog} closeDialogHandler={deleteDialogHandler}/>}
    {showViewDialog&&<Modal dialogData={{title:`${rowData.customerName}'s Indent`,desc:'',okButtonTitle:'OK', heigWidt:'h-150 w-170'}} open={showViewDialog} closeDialogHandler={viewDialogHandler}><ViewIndent/></Modal>}
    {showSideSheet&&<SideSheet sideSheetData={{title:`${rowData.customerName}'s Indent`}} closeSheetHandler={sideSheetHandler} open={showSideSheet}><NewIndent/></SideSheet>}
    <main>
        <div className='my-2 px-4 py-2 bg-secondary rounded-md'>
            <h1 className='font-semibold'>Indent</h1>
        </div>
        <section>
            <DataTable renderRowActions={(row)=>actionButtons(row,deleteDialogHandler,viewDialogHandler,sideSheetHandler)} filter={{searchPlaceholder:'Customer Name',filterColumn:'customerName'}} columns={columns} data={indentData}/>
        </section>
    </main>
    </>
  )
}

export default Indent