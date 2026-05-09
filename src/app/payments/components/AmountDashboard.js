"use client";
import React from "react";
import AmountNavbar from "./AmountNavbar";
import DatePicker from "@/components/reusable/DatePicker";
import DataTable from "@/components/reusable/DataTable/DataTable";
import PaymentsTable from "./PaymentsTable";

const data = [{ id: 1, customerName: "Rethvik", payment: 1000, input: "" }];
const AmountDashboard = () => {
  return (
    <>
      {/* <AmountNavbar /> */}
      <PaymentsTable />
    </>
  );
};

export default AmountDashboard;
