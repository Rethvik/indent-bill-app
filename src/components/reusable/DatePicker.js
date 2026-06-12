"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIndentSelectedDate } from "@/store/store";
function formatDate(date) {
  if (!date) {
    return "";
  }
  // date.setDate(date.getDate()+1)
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}
function isFutureDate(date) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(23, 59, 59, 999);

  return date > tomorrow;
}
export default React.memo(function DatePicker({
  label,
  getDateValue,
  disableDateHandler,
}) {
  let firstDate = new Date();

  firstDate.setDate(firstDate.getDate() + 1);

  console.log(firstDate);
  const [open, setOpen] = React.useState(false);
  const [date, setDateValue] = React.useState(firstDate);
  const [month, setMonth] = React.useState(date);
  const [value, setValue] = React.useState(formatDate(date));
  const fetchDone = React.useRef(false);
  const updateDate = useIndentSelectedDate((state) => state.updateDate);
  const getSelectedDate = (e) => {
    const date = new Date(e.target.value);
    setValue(e.target.value);
    if (isValidDate(date)) {
      setDateValue(date);
      setMonth(date);
    }
  };
  React.useEffect(() => {
    if (fetchDone.current) {
      return;
    }
    updateDate(formatDate(date));
    getDateValue(formatDate(date));
    fetchDone.current = true;
  }, [date, getDateValue, updateDate]);
  return (
    <div className="flex flex-col gap-3">
      {label && (
        <Label htmlFor="date" className="px-1">
          {label}
        </Label>
      )}
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={value}
          placeholder="June 01, 2025"
          className="bg-background pr-10"
          onChange={getSelectedDate}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              endMonth={new Date("2030-12-31")}
              disabled={
                disableDateHandler
                  ? (date) => disableDateHandler(date)
                  : (date) => isFutureDate(date)
              }
              onSelect={(date) => {
                if (date) {
                  fetchDone.current = false;
                  getDateValue(formatDate(date));
                  setDateValue(date);
                  setValue(formatDate(date));
                }
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
});
