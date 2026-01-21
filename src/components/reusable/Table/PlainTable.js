import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function PlainTable({ data, tableHeaders }) {
  return (
    <ScrollArea className="h-110">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-white">
          <TableRow>
            {tableHeaders.map((item, index) => (
              <TableHead key={index}>{item.title}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="mt-2">
          {data.map((item, index) => {
            return (
              <TableRow key={index}>
                {tableHeaders.map((col, index) => {
                  return (
                    <TableCell key={col.accessorKey}>
                      {item[col.accessorKey]}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
          {/* {data.map((item) => (
            <TableRow key={item.product}>
              <TableCell>{item.product}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.unit}</TableCell>
            </TableRow>
          ))} */}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
export default PlainTable;
