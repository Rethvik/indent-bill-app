"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DatePicker from "@/components/reusable/DatePicker";
import React from "react";

function Purchase() {
  const getDateValue = (value) => {
    console.log(value);
  };
  return (
    <section className="my-4 px-2 w-full flex flex-row justify-between">
      <DatePicker label="" getDateValue={getDateValue} />
      <Button variant="green">
        {" "}
        <Plus />
        Create Purchase
      </Button>
    </section>
  );
}

export default Purchase;
