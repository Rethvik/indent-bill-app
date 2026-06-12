import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pencil, Trash } from "lucide-react";
import APP_CONSTANT from "@/consts/appConstants";
import { Button } from "@/components/ui/button";
const actionButtons = (row, deleteHandler, editDialogHandler) => {
  return (
    <div className="flex">
      <div className="flex">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="mr-3"
              variant="purple"
              size="icon-xsm"
              onClick={() => editDialogHandler(row)}
            >
              <Pencil />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit Indent</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => deleteHandler(row)}
              variant="destructive"
              size="icon-xsm"
            >
              {" "}
              <Trash />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete Indent</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
export default actionButtons;
