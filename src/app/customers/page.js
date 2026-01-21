"use client";
import DataTable from "@/components/reusable/DataTable/DataTable";
import React, { useEffect, useState, useCallback, useRef } from "react";
// import customersData from './data/customersData';
import columns from "./data/columns";
import Loader from "@/components/reusable/Loader/Loader";
import { useShowLoader, useShowMessage } from "@/store/store";
import { api } from "@/lib/api";
function Customers() {
  const [customers, setCustomers] = useState([]);
  const loader = useShowLoader((state) => state.loader);
  const showLoader = useShowLoader((state) => state.showLoader);
  const showMessage = useShowMessage((state) => state.showMessage);
  const fetchDone = useRef(false);
  useEffect(() => {
    if (fetchDone.current) {
      return;
    }
    fetchDone.current = true;
    const fetchCustomers = async () => {
      showLoader(true);
      const response = await fetch("http://localhost:3000/api/customers");
      const result = await response.json();
      showLoader(false);
      if (result.success) {
        setCustomers(result.customers);
        if (result.showMessage) {
          showMessage("success", result.message);
        }
      } else {
        setCustomers([]);
        if (result.showMessage) {
          showMessage("error", result.message);
        }
      }
    };

    fetchCustomers();
  }, [showLoader, showMessage]);
  return (
    <>
      {loader && <Loader />}
      <main className="mt-3">
        <div className="my-2 px-4 py-2 bg-secondary rounded-md">
          <h1 className="font-semibold">Customers</h1>
        </div>
        <section>
          <DataTable
            showFooter={true}
            filter={{ searchPlaceholder: "customers", filterColumn: "name" }}
            data={customers}
            columns={columns}
          />
        </section>
      </main>
    </>
  );
}

export default Customers;
