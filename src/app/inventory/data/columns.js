"use client";

import { Box, ShoppingCart, Boxes } from "lucide-react";

const { Badge } = require("@/components/ui/badge");

const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: () => (
      <div className="flex items-center">
        <Box className="mr-1" size={15} />
        Product
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: () => (
      <div className="flex items-center">
        <ShoppingCart className="mr-1" size={15} />
        Stock
      </div>
    ),
    cell: ({ row }) => (
      <Badge
        variant="orange"
        className="h-5 min-w-5 ml-5 rounded-full px-1 font-mono tabular-nums"
      >
        {row.getValue("quantity")}
      </Badge>
    ),
  },
  {
    accessorKey: "unit",
    header: () => (
      <div className="flex items-center">
        <Boxes className="mr-1" size={15} />
        UOM
      </div>
    ),
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="h-7 min-w-5 rounded-full px-1 font-mono tabular-nums"
      >
        {row.getValue("unit")}
      </Badge>
    ),
  },
];
export default columns;
