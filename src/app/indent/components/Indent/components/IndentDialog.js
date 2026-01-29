import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export function IndentDialog({ open, children, dialogData }) {
  return (
    <Dialog className="h-[300px]" open={open}>
      <DialogContent
        aria-describedby="Dialog Indent"
        className="!max-w-[550px] w-full"
      >
        <DialogHeader>
          <DialogTitle>
            <p>
              <span className="bg-blue-200 border-2 p-1 border-blue-400 rounded-sm mr-3">
                {dialogData.date}
              </span>
              {dialogData.title}
            </p>
          </DialogTitle>
          <Separator className="mt-1 bg-green-600" />
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
}
