"use client";
import React from "react";
import AmountNavbar from "./AmountNavbar";
import DatePicker from "@/components/reusable/DatePicker";
import DataTable from "@/components/reusable/DataTable/DataTable";
import PaymentsTable from "./PaymentsTable";
import { Button } from "@/components/ui/button";

const data = [{ id: 1, customerName: "Rethvik", payment: 1000, input: "" }];
const AmountDashboard = () => {
  return (
    <>
      {/* <AmountNavbar /> */}
      <PaymentsTable />
      <Button>Save Payments</Button>
    </>
  );
};

export default AmountDashboard;
