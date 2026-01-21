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
    accessorKey: "customerName",
    header: () => (
      <div className="flex items-center">
        <User className="mr-1" size={15} />
        Customer
      </div>
    ),
  },
  {
    accessorKey: "contact",
    header: () => (
      <div className="flex items-center">
        <Smartphone className="mr-1" size={15} />
        Contact
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
            row.getValue("status") === APP_CONSTANT.ORDERED
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
