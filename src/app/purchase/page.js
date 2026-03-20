"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import DataTable from "@/components/reusable/DataTable/DataTable";
import columns from "./data/columns";
import {
  useIndentSelectedDate,
  useShowLoader,
  useShowMessage,
} from "@/store/store";
import actionButtons from "./data/actionButtons";
import Loader from "@/components/reusable/Loader/Loader";
import { IndentDialog } from "../indent/components/Indent/components/IndentDialog";
import NewIndent from "../indent/components/Indent/NewIndent";
import { Modal } from "@/components/reusable/Dialog/Modal";
import ViewIndent from "../indent/components/Dialogs/ViewIndent";
function Purchase() {
  const fetchDone = useRef(false);
  const [purchaseData, setPurchaseData] = useState([]);
  const [rowData, setRowData] = useState({});
  const [showAddEditDialog, setShowAddEditDialog] = useState(false);
  const [type, setType] = useState("");
  const [supplierIndent, setSupplierIndent] = useState([]);
  const [viewData, setViewData] = useState([]);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const showLoader = useShowLoader((state) => state.showLoader);
  const showMessage = useShowMessage((state) => state.showMessage);
  const date = useIndentSelectedDate((state) => state.date);
  const loader = useShowLoader((state) => state.loader);
  const getPurchaseData = useCallback(
    async (selectedDate) => {
      showLoader(true);
      const params = new URLSearchParams({ selectedDate });
      const response = await fetch(
        `http://localhost:3000/api/purchase?${params}`,
        {
          method: "GET",
        },
      );
      const result = await response.json();
      if (result.success) {
        setPurchaseData(result.data);
        showLoader(false);
      } else {
        showMessage("error", result.message);
        showLoader(false);
        setPurchaseData([]);
      }
    },
    [showLoader, showMessage],
  );

  const openAddDialogHandler = () => {
    setShowAddEditDialog(true);
    setType("new");
  };
  const addPurchaseButtonHandler = (row) => {
    setRowData(row);
    openAddDialogHandler();
  };
  const closeAddEditDialogHandler = () => {
    setShowAddEditDialog(false);
    setSupplierIndent([]);
    setType("");
  };

  const saveButtonHandler = async (purchase) => {
    if (purchase.length > 0) {
      closeAddEditDialogHandler();
      showLoader(true);
      const response = await fetch("http://localhost:3000/api/purchase/save", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          purchaseInfo: { ...rowData, items: purchase },
          type,
        }),
      });
      const result = await response.json();
      showLoader(false);
      if (result.success) {
        showMessage("success", result.message);
        getPurchaseData(date);
      } else {
        showMessage("error", result.message);
      }
    } else {
      showMessage("info", "Purchase Not Entered");
    }
  };

  // To edit the customer indent
  const editDialogHandler = async (row) => {
    setRowData(row);
    setType("edit");
    const result = await getSupplierPurchase(row.id, date);
    if (result.success) {
      setSupplierIndent(result.data);
      setShowAddEditDialog(true);
    } else {
      showMessage("error", result.message);
    }
  };
  // To get the indent of customer based on id
  const getSupplierPurchase = async (id, date) => {
    let params = { id, date };
    params = new URLSearchParams(params);
    showLoader(true);
    const response = await fetch(
      `http://localhost:3000/api/purchase/get?${params}`,
      { method: "GET" },
    );
    const result = await response.json();
    showLoader(false);
    return result;
  };

  // To see the customer indent
  const viewDialogHandler = async (row) => {
    setRowData(row);
    const result = await getSupplierPurchase(row.id, date);
    if (result.success) {
      setViewData(result.data);
      setShowViewDialog((prev) => !prev);
    } else {
      showMessage("error", result.message);
      setViewData([]);
    }
  };
  const closeViewDialogHandler = () => {
    setShowViewDialog(false);
  };

  // Delete Purchase
  const closeDeleteDialogHandler = () => {
    setShowDeleteDialog(false);
  };
  const deleteDialogHandler = (row) => {
    setRowData(row);
    setShowDeleteDialog(true);
  };
  const deletePurchase = async () => {
    const data = { id: rowData?.id, date };
    const params = new URLSearchParams(data);
    const response = await fetch(
      `http://localhost:3000/api/purchase/delete?${params}`,
      { method: "DELETE" },
    );
    const result = await response.json();
    if (result.success) {
      getPurchaseData(date);
      showMessage("success", result.message);
    } else {
      showMessage("error", result.message);
    }
    closeDeleteDialogHandler();
  };

  useEffect(() => {
    if (fetchDone.current) {
      return;
    }
    fetchDone.current = true;
  }, [showLoader, showMessage]);
  const getDateValue = (value) => {
    getPurchaseData(value);
  };
  return (
    <>
      {loader && <Loader />}
      {showDeleteDialog && (
        <Modal
          dialogData={{
            title: "Delete Confirmation",
            desc: "Are you sure, you want to delete",
            cancelButtonTitle: "Yes",
            okButtonTitle: "No",
          }}
          open={showDeleteDialog}
          closeDialogHandler={closeDeleteDialogHandler}
          cancelButtonHandler={deletePurchase}
        />
      )}
      {showViewDialog && (
        <Modal
          dialogData={{
            title: `${rowData.supplierName}'s Purchase`,
            desc: "",
            okButtonTitle: "OK",
            heigWidt: "h-150 w-170",
          }}
          open={showViewDialog}
          closeDialogHandler={closeViewDialogHandler}
        >
          <ViewIndent data={viewData} />
        </Modal>
      )}
      {showAddEditDialog && (
        <IndentDialog
          dialogData={{
            title: `${rowData.supplierName}'s Purchase`,
            desc: "",
            okButtonTitle: "OK",
            date: date,
          }}
          open={showAddEditDialog}
          closeDialogHandler={closeAddEditDialogHandler}
        >
          <NewIndent
            key={rowData.id}
            saveButtonHandler={saveButtonHandler}
            closeDialogHandler={closeAddEditDialogHandler}
            customerIndent={supplierIndent}
          />
        </IndentDialog>
      )}
      <main>
        <section>
          <div className="my-2 px-4 py-2 bg-secondary rounded-md">
            <h1 className="font-semibold">Purchase</h1>
          </div>
          <DataTable
            getDateValue={getDateValue}
            datePicker={{ show: true }}
            showFooter={true}
            renderRowActions={(row) =>
              actionButtons(
                row,
                addPurchaseButtonHandler,
                deleteDialogHandler,
                viewDialogHandler,
                editDialogHandler,
              )
            }
            filter={{
              searchPlaceholder: "Supplier Name",
              filterColumn: "supplierName",
            }}
            columns={columns}
            data={purchaseData}
          />
        </section>
      </main>
    </>
  );
}

export default Purchase;
