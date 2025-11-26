import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus,Pencil,Eye,Trash} from "lucide-react";
import APP_CONSTANT from '@/consts/appConstants'
import { Button } from "@/components/ui/button";
const actionButtons = (row,deleteHandler,viewHandler,sheetHandler)=>{
    return <div className='flex'>
        {row.status===APP_CONSTANT.ORDERED?
            <div className='flex'>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button className='mr-3' variant='purple' size='icon-xsm'><Pencil/></Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Edit Indent</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button onClick={()=>viewHandler(row)} className='mr-3' variant='sky' size='icon-xsm'><Eye/></Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>View Indent</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button onClick={deleteHandler} variant='destructive' size='icon-xsm'> <Trash/></Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Delete Indent</p>
                    </TooltipContent>
                </Tooltip>
            </div>
            :
            <div>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button onClick={()=>sheetHandler(row)} className='mr-3' variant='secondary' size='icon-xsm'><Plus/></Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Add Indent</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        }
    </div>
}
export default actionButtons