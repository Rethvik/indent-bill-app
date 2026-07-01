import PlainTable from "@/components/reusable/Table/PlainTable";
import tableHeaders from "./data/tableHeaders";
// import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
// import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Search } from "lucide-react";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import PaymentInput from "./PaymentInput";
import DatePicker from "@/components/reusable/DatePicker";
import {
  useIndentSelectedDate,
  useShowLoader,
  useShowMessage,
} from "@/store/store";
import Loader from "@/components/reusable/Loader/Loader";

function PaymentsTable() {
  const [data, setData] = useState([]);
  const [currentList, setCurrentList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [focusedRow, setFocusedRow] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const date = useIndentSelectedDate((state) => state.date);
  const showLoader = useShowLoader((state) => state.showLoader);
  const loader = useShowLoader((state) => state.loader);
  const showMessage = useShowMessage((state) => state.showMessage);
  const totalSaleValue = useMemo(
    () => data.reduce((sum, c) => sum + c.totalAmount, 0),
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

  // Get Payments
  const getPaymentData = useCallback(
    async (selectedDate) => {
      showLoader(true);
      const params = new URLSearchParams({ selectedDate });
      const response = await fetch(
        `http://localhost:3000/api/payments?${params}`,
        {
          method: "GET",
        },
      );
      const result = await response.json();
      if (result.success) {
        setData(result.data);
        setCurrentList(result.data);
        showMessage("success", result.message);
      } else {
        showMessage("error", result.message);
      }
      showLoader(false);
    },
    [showLoader, showMessage],
  );

  // Update Payment
  const updatePayment = async (id, amount) => {
    const updatedData = data.map((item) => {
      if (item.customer_id === id) {
        return {
          ...item,
          paymentReceived: Number(amount),
          paymentCreatedAt: new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        };
      }
      return item;
    });
    showLoader(true);
    const response = await fetch("http://localhost:3000/api/payments/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pdfData: updatedData,
        date,
        customer_id: id,
        payment_received: Number(amount),
      }),
    });
    const result = await response.json();
    if (!result.success) {
      showMessage("error", result.message);
    } else {
      showMessage("success", result.message);
      setData(updatedData);
      setCurrentList(updatedData);
    }
    showLoader(false);
  };

  // Delete Payments
  const deletePayment = async (customer_id) => {
    const updatedData = data.map((item) => {
      if (item.customer_id === customer_id) {
        return { ...item, paymentReceived: 0 };
      }
      return item;
    });
    showLoader(true);
    const response = await fetch("http://localhost:3000/api/payments/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pdfData: updatedData,
        date,
        customer_id,
      }),
    });
    // const response = await fetch(
    //   `http://localhost:3000/api/payments/delete?${params}`,
    //   { method: "POST" },
    // );
    const result = await response.json();
    if (!result.success) {
      showMessage("error", result.message);
    } else {
      showMessage("success", result.message);
      setData(updatedData);
      setCurrentList(updatedData);
    }
    showLoader(false);
  };
  const getDateValue = (value) => {
    getPaymentData(value);
    const currentDate = new Date();
    const selectedDate = new Date(value);
    const d1 = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
    );
    const d2 = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
    );
    const diff = (d1 - d2) / (1000 * 60 * 60 * 24);
    if (diff === 0 || diff === -1) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };
  return (
    <>
      {loader && <Loader />}
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
          deletePayment={deletePayment}
          totalSaleValue={totalSaleValue}
          totalPaymentReceived={totalPaymentReceived}
          allowEditInput={!disabled}
        />
      </div>
    </>
  );
}

export default PaymentsTable;
