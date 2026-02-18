"use client";
import React, { useEffect, useRef, useState } from "react";
import DataTable from "@/components/reusable/DataTable/DataTable";
import inventoryData from "@/app/inventory/data/dataTableData";
import columns from "@/app/inventory/data/columns";
import { useShowLoader, useShowMessage } from "@/store/store";
function Inventory() {
  const fetchDone = useRef(false);
  const [products, setProducts] = useState([]);
  const showLoader = useShowLoader((state) => state.showLoader);
  const showMessage = useShowMessage((state) => state.showMessage);
  useEffect(() => {
    if (fetchDone.current) {
      return;
    }
    fetchDone.current = true;
    const fetchProducts = async () => {
      showLoader(true);
      const response = await fetch("http://localhost:3000/api/products");
      const result = await response.json();
      showLoader(false);
      if (result.success) {
        setProducts(result.data);
        showMessage("success", result.message);
      } else {
        showMessage("error", result.message);
      }
    };

    fetchProducts();
  }, [showLoader, showMessage]);
  return (
    <main>
      <section>
        <div className="my-2 px-4 py-2 bg-secondary rounded-md">
          <h1 className="font-semibold">Inventory</h1>
        </div>
        <DataTable
          showFooter={true}
          filter={{
            searchPlaceholder: "products",
            filterColumn: "name",
          }}
          data={products}
          columns={columns}
        />
      </section>
    </main>
  );
}

export default Inventory;
