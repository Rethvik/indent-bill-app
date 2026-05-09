import PlainTable from "@/components/reusable/Table/PlainTable";
// import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
// import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Search } from "lucide-react";
import React, { useState, useMemo } from "react";
import PaymentInput from "./PaymentInput";
import DatePicker from "@/components/reusable/DatePicker";
const master = [
  { id: 1, name: "Rethvik", paymentReceived: 1000, amount: 1000 },
  { id: 2, name: "John Doe", paymentReceived: 500, amount: 1500 },
];
const tableHeaders = [
  { accessorKey: "id", title: "ID" },
  { accessorKey: "name", title: "Customer Name" },
  { accessorKey: "amount", title: "Bill Amount" },
  { accessorKey: "paymentReceived", title: "Payment Received" },
];

function PaymentsTable() {
  const [data, setData] = useState(master);
  const [currentList, setCurrentList] = useState(data);
  const [searchValue, setSearchValue] = useState("");
  const [focusedRow, setFocusedRow] = useState(null);

  const totalSaleValue = useMemo(
    () => data.reduce((sum, c) => sum + c.amount, 0),
    [data],
  );

  const totalPaymentReceived = useMemo(
    () => data.reduce((sum, c) => sum + c.paymentReceived, 0),
    [data],
  );

  //   Filter search handler for payments table
  const filterSearchHandler = (e) => {
    setSearchValue(e.target.value);
    const filteredData = data.filter((customer) =>
      customer.name.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setCurrentList(filteredData);
  };
  const getDateValue = (value) => {
    console.log(value);
  };

  const updatePayment = (id, amount) => {
    const updatedData = data.map((item) => {
      if (item.id === id) {
        return { ...item, paymentReceived: Number(amount) };
      }
      return item;
    });
    setData(updatedData);
    setCurrentList(updatedData);
  };

  return (
    <>
      <div className="flex justify-between">
        <InputGroup className="mb-3 mr-3 w-120">
          <InputGroupInput
            value={searchValue}
            onChange={filterSearchHandler}
            placeholder="Search Customers..."
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            {currentList.length} Customers
          </InputGroupAddon>
        </InputGroup>
        <DatePicker getDateValue={getDateValue} />
      </div>
      <div>
        <PlainTable
          data={currentList}
          tableHeaders={tableHeaders}
          inputHeader="Amount"
          showInput={true}
          InputComponent={PaymentInput}
          setFocusedRow={setFocusedRow}
          focusedRow={focusedRow}
          updatePayment={updatePayment}
          totalSaleValue={totalSaleValue}
          totalPaymentReceived={totalPaymentReceived}
        />
      </div>
    </>
  );
}

export default PaymentsTable;
