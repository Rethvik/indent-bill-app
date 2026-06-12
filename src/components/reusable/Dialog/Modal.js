import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export function Modal({
  open,
  closeDialogHandler,
  children,
  dialogData,
  cancelButtonHandler,
  style,
}) {
  return (
    <Dialog open={open} onOpenChange={closeDialogHandler}>
      <DialogContent
        style={style && { ...style }}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{dialogData?.title}</DialogTitle>
          <DialogDescription>{dialogData?.desc}</DialogDescription>
          <Separator />
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
