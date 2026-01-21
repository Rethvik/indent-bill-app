import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function Modal({
  open,
  closeDialogHandler,
  children,
  dialogData,
  cancelButtonHandler,
}) {
  return (
    <Dialog open={open}>
      <DialogContent className={`${dialogData?.heigWidt}`}>
        <DialogHeader>
          <DialogTitle>{dialogData?.title}</DialogTitle>
          <DialogDescription>{dialogData?.desc}</DialogDescription>
        </DialogHeader>
        <div>{children}</div>
        <DialogFooter>
          {dialogData?.cancelButtonTitle && (
            <Button variant="destructive" onClick={() => cancelButtonHandler()}>
              {dialogData.cancelButtonTitle}
            </Button>
          )}
          {dialogData?.okButtonTitle && (
            <Button
              variant="outline"
              onClick={() => closeDialogHandler()}
              type="submit"
            >
              {dialogData.okButtonTitle}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
