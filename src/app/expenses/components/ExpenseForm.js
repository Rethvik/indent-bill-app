import DatePicker from "@/components/reusable/DatePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, IndianRupee } from "lucide-react";
import React, { useState } from "react";
const allowedDates = [new Date(), new Date(Date.now() + 24 * 60 * 60 * 1000)];

function ExpenseForm({ row, expenseSaveHandler }) {
  const [error, setError] = useState({ expenseName: false, amount: false });
  const [expenseData, setExpenseData] = useState(row || {});

  const disableDateHandler = (date) => {
    return !allowedDates.some(
      (allowed) =>
        date.getFullYear() === allowed.getFullYear() &&
        date.getMonth() === allowed.getMonth() &&
        date.getDate() === allowed.getDate(),
    );
  };
  const expenseTypeChangeHandler = (value) => {
    setExpenseData({ ...expenseData, expenseName: value });
  };
  const expenseAmountChangeHandler = (e) => {
    if (!/^\d*$/.test(e.target.value)) {
      return;
    }
    setExpenseData({ ...expenseData, amount: e.target.value });
  };
  const getDateValue = (value) => {
    console.log(value);
  };
  const saveButtonHandler = () => {
    const { expenseName, amount } = expenseData;
    if (amount === "" || amount === "0") {
      setError((prev) => ({ ...prev, amount: true }));
      return;
    } else {
      setError((prev) => ({ ...prev, amount: false }));
    }
    if (expenseName === "") {
      setError((prev) => ({ ...prev, expenseName: true }));
      return;
    } else {
      setError((prev) => ({ ...prev, expenseName: false }));
    }
    if (expenseData.id) {
      expenseSaveHandler({ id: expenseData.id, expenseName, amount });
      return;
    }
    expenseSaveHandler({ expenseName, amount });
  };

  return (
    <div className="flex justify-between">
      <section className="flex flex-row items-center justify-between">
        <div className="mr-5">
          <Select
            onValueChange={expenseTypeChangeHandler}
            defaultValue={
              expenseData?.expenseName ? expenseData.expenseName : ""
            }
          >
            <SelectTrigger aria-invalid={error.expenseName} className="w-60">
              <SelectValue
                value={expenseData?.expenseName}
                placeholder="ఖర్చు రకం / Expense Type"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Shop Maintainence">
                  Shop Maintainence
                </SelectItem>
                <SelectItem value="Auto Maintainence">
                  Auto Maintainence
                </SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Advance">Advance</SelectItem>
                <SelectItem value="Intertrip">Intertrip</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="relative">
          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            // onChange={(e) => quantityChangeHandler(e, item)}
            name="expenseAmount"
            onWheel={(event) => event.currentTarget.blur()}
            className="pl-9 w-50 mr-5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Enter expense amount"
            value={expenseData?.amount || ""}
            onChange={expenseAmountChangeHandler}
            aria-invalid={error.amount}
          />
        </div>
        <div>
          <DatePicker
            disableDateHandler={disableDateHandler}
            getDateValue={getDateValue}
          />
        </div>
      </section>
      <section className="flex items-center">
        <Button
          className="mx-3"
          variant="green"
          size="icon-sm"
          onClick={saveButtonHandler}
        >
          <Check />
        </Button>
      </section>
    </div>
  );
}

export default ExpenseForm;
