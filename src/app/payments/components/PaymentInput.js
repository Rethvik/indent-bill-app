import react, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
const PaymentInput = ({
  row,
  focusedRow,
  setFocusedRow,
  disabled,
  updatePayment,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(false);
  const inputChangeHandler = (e) => {
    if (!/^\d*$/.test(e.target.value)) {
      return;
    }
    setInputValue(e.target.value);
  };

  const focusHandler = (e) => {
    setFocusedRow(row.id);
  };

  const checkButtonHandler = () => {
    if (inputValue === "") {
      setError(true);
      return;
    }
    console.log("Payment Updated for ", row.name, " with amount ", inputValue);
    updatePayment(row.id, inputValue);
    setFocusedRow(null);
    setInputValue("");
    setError(false);
  };

  const cancelButtonHandler = () => {
    setFocusedRow(null);
    setInputValue("");
    setError(false);
  };
  return (
    <div className="flex items-center">
      <Input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={inputValue}
        onChange={inputChangeHandler}
        onWheel={(event) => event.currentTarget.blur()}
        onFocus={focusHandler}
        className="w-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        placeholder="Enter Amount"
        disabled={disabled}
        aria-invalid={error}
      />
      {row.id === focusedRow && (
        <div className="ml-3">
          <Button
            onClick={checkButtonHandler}
            className="mr-3"
            variant="green"
            size="icon-xsm"
          >
            <Check />
          </Button>
          <Button
            className="mr-3"
            variant="destructive"
            size="icon-xsm"
            onClick={cancelButtonHandler}
          >
            <X />
          </Button>
        </div>
      )}
    </div>
  );
};
export default PaymentInput;
