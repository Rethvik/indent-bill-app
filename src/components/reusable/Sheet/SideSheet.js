import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

function SideSheet({open,closeSheetHandler,sideSheetData,children}) {
  return (
    <Sheet open={open}>
      <SheetContent className="!w-[650px] !max-w-none px-2">
        <SheetHeader>
          <SheetTitle>{sideSheetData.title}</SheetTitle>
        </SheetHeader>
        {children}
        <SheetFooter>
          <Button onClick={closeSheetHandler} variant='teal'  type="submit">Save changes</Button>
          <SheetClose asChild>
            <Button onClick={closeSheetHandler} variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
export default SideSheet;