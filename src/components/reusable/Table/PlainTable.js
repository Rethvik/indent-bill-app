import { Input } from "@/components/ui/input";
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

function PlainTable({
  data,
  tableHeaders,
  totalAmount,
  totalCrates,
  showInput,
  inputHeader,
  InputComponent,
  focusedRow,
  setFocusedRow,
  updatePayment,
  totalSaleValue,
  totalPaymentReceived,
}) {
  return (
    <ScrollArea className="h-110">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-white">
          <TableRow>
            {tableHeaders.map((item, index) => (
              <TableHead
                className="border border-border text-center"
                key={index}
              >
                {item.title}
              </TableHead>
            ))}
            {showInput && (
              <TableHead className="border border-border text-center">
                {inputHeader}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody className="mt-2">
          {data.length > 0 ? (
            data.map((item, index) => {
              return (
                <TableRow key={index}>
                  {tableHeaders.map((col, index) => {
                    return (
                      <TableCell
                        className="border border-border text-center"
                        key={index}
                      >
                        {item[col.accessorKey]}
                      </TableCell>
                    );
                  })}
                  {showInput && (
                    <TableCell className="border border-border text-center w-150">
                      {
                        <InputComponent
                          row={item}
                          disabled={focusedRow ? focusedRow !== item.id : false}
                          focusedRow={focusedRow}
                          setFocusedRow={setFocusedRow}
                          updatePayment={updatePayment}
                        />
                      }
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                className="border border-border text-center"
                colSpan={tableHeaders.length + (showInput ? 1 : 0)}
              >
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        {totalAmount && (
          <TableFooter>
            <TableRow>
              <TableCell
                className="border border-border text-center"
                colSpan={3}
              >
                Total
              </TableCell>
              <TableCell className="border border-border text-center">
                {totalAmount}
              </TableCell>
              <TableCell className="border border-border text-center">
                {totalCrates}
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
        {totalSaleValue && (
          <TableFooter>
            <TableRow>
              <TableCell
                className="border border-border text-center"
                colSpan={2}
              >
                Total
              </TableCell>
              <TableCell className="border border-border text-center">
                {totalSaleValue}
              </TableCell>
              <TableCell className="border border-border text-center">
                {totalPaymentReceived}
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </ScrollArea>
  );
}
export default PlainTable;
