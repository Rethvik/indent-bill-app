import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function PlainTable({ data, tableHeaders, totalAmount }) {
  return (
    <ScrollArea className="h-110">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-white">
          <TableRow>
            {tableHeaders.map((item, index) => (
              <TableHead className="border border-border" key={index}>
                {item.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="mt-2">
          {data.map((item, index) => {
            return (
              <TableRow key={index}>
                {tableHeaders.map((col, index) => {
                  return (
                    <TableCell className="border border-border" key={index}>
                      {item[col.accessorKey]}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
        {totalAmount && (
          <TableFooter>
            <TableRow>
              <TableCell className="border border-border" colSpan={3}>
                Total Amount
              </TableCell>
              <TableCell className="border border-border">
                {totalAmount}
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </ScrollArea>
  );
}
export default PlainTable;
