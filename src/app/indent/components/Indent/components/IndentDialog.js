import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { DialogDescription } from "@radix-ui/react-dialog"

export function IndentDialog({open,children,dialogData}) {
  return (
    <Dialog  open={open}>
        <DialogContent aria-describedby='Dialog Indent' className='!max-w-[550px] w-full'>
        <DialogHeader>
            <DialogTitle>
                <p>{dialogData.title}</p>
            </DialogTitle>
            <Separator className='mt-2 bg-green-600'/>
        </DialogHeader>
          <div>
            {children}
          </div>
        </DialogContent>
    </Dialog>
  )
}
