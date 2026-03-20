import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { DialogDescription } from "@radix-ui/react-dialog";

export function IndentDialog({
  open,
  children,
  dialogData,
  closeDialogHandler,
}) {
  return (
    <Dialog className="h-[300px]" open={open} onOpenChange={closeDialogHandler}>
      <DialogContent
        aria-describedby="Dialog Indent"
        className="!max-w-[550px] w-full"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            <p>
              {/* <span className="bg-blue-200 border-2 p-1 border-blue-400 rounded-sm mr-3">
                {dialogData.date}
              </span> */}
              {dialogData.title}
            </p>
          </DialogTitle>
          <DialogDescription>
            <span className="bg-green-200 border-1 p-1 border-green-300 rounded-sm">
              {dialogData.date}
            </span>
          </DialogDescription>
          <Separator className="mt-1 bg-green-600" />
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
}
