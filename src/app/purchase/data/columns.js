"use client";
import { Badge } from "@/components/ui/badge";
import APP_CONSTANT from "@/consts/appConstants";
import { User, CircleStar, Smartphone } from "lucide-react";

const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "supplierName",
    header: () => (
      <div className="flex items-center">
        <User className="mr-1" size={15} />
        Supplier
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="flex items-center">
        <CircleStar className="mr-1" size={15} />
        Status
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex">
        <Badge
          variant={
            row.getValue("status") === APP_CONSTANT.PURCHASED
              ? "emerald"
              : "redoutline"
          }
        >
          {row.getValue("status")}
        </Badge>
      </div>
    ),
  },
];
export default columns;
