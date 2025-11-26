"use client"
import React from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"



export function DataTable({
  columns,
  data,
  filter,
  button,
  renderRowActions
}) {
  const [columnFilters, setColumnFilters] = React.useState([])
//   const [pagination, setPagination] = React.useState({
//   pageIndex: 0,
//   pageSize: 7,
// })
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    // onPaginationChange:setPagination,
    state: {
      columnFilters,
      // pagination,
    },
  })

  return (
    <div>
      {filter&&
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder={`Filter ${filter.searchPlaceholder}...`}
          value={table.getColumn(filter.filterColumn)?.getFilterValue() || ""}
          onChange={(event) =>
            table.getColumn(filter.filterColumn)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {button?.show&& <Button variant={button.variant}>{button.icon}{button.label}</Button>}
      </div>}
      <div className="overflow-hidden rounded-md border">
        <ScrollArea className="h-[400px] w-full rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getFilteredRowModel().rows?.length ? (
              table.getFilteredRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className='py-3' key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                  {renderRowActions&&<TableCell className='py-3'>
                    {renderRowActions(row.original)}
                    </TableCell>}
                </TableRow>
                
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </ScrollArea>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          Total {table.getFilteredRowModel().rows.length} row(s).
        </div>
      </div>
    </div>
  )
}
export default DataTable