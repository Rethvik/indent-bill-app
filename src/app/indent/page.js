"use client";
import DataTable from "@/components/reusable/DataTable/DataTable";
import React, { useCallback, useState } from "react";
import columns from "./data/columns";
import actionButtons from "./actionButtons";
import { Modal } from "@/components/reusable/Dialog/Modal";
import ViewIndent from "./components/Dialogs/ViewIndent";
import NewIndent from "./components/Indent/NewIndent";
import { IndentDialog } from "./components/Indent/components/IndentDialog";
import {
  useShowLoader,
  useShowMessage,
  useIndentSelectedDate,
} from "@/store/store";
import Loader from "@/components/reusable/Loader/Loader";
function Indent() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showAddEditDialog, setShowAddEditDialog] = useState(false);
  const [rowData, setRowData] = useState({});
  const [indent, setIndent] = useState([]);
  const [viewData, setViewData] = useState([]);
  const [customerIndent, setCustomerIndent] = useState([]);
  const [type, setType] = useState("");
  const loader = useShowLoader((state) => state.loader);
  const showLoader = useShowLoader((state) => state.showLoader);
  const showMessage = useShowMessage((state) => state.showMessage);
  const date = useIndentSelectedDate((state) => state.date);
  const getIndentData = useCallback(
    async (selectedDate) => {
      showLoader(true);
      const response = await fetch("http://localhost:3000/api/indent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedDate }),
      });
      const result = await response.json();
      if (result.success) {
        setIndent(result.indent);
        showLoader(false);
      } else {
        showMessage("error", result.message);
        showLoader(false);
        setIndent([]);
      }
    },
    [showLoader, showMessage],
  );

  // To get the indent of customer based on id
  const getIndentOfCustomer = async (id, date) => {
    let params = { id, date };
    params = new URLSearchParams(params);
    const response = await fetch(
      `http://localhost:3000/api/indent/get?${params}`,
      { method: "GET" },
    );
    const result = await response.json();
    return result;
  };

  // To see the customer indent
  const viewDialogHandler = async (row) => {
    setRowData(row);
    const result = await getIndentOfCustomer(row.id, date);
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

  // To delete the customer indent
  const deleteIndent = async () => {
    const data = { id: rowData?.id, date };
    const params = new URLSearchParams(data);
    const response = await fetch(
      `http://localhost:3000/api/indent/delete?${params}`,
      { method: "DELETE" },
    );
    const result = await response.json();
    if (result.success) {
      getIndentData(date);
      showMessage("success", result.message);
    } else {
      showMessage("error", result.message);
    }
    closeDeleteDialogHandler();
  };
  const deleteDialogHandler = (row) => {
    setRowData(row);
    setShowDeleteDialog(true);
  };
  const closeDeleteDialogHandler = () => {
    setShowDeleteDialog(false);
  };

  // To edit the customer indent
  const editDialogHandler = async (row) => {
    setRowData(row);
    setType("edit");
    const result = await getIndentOfCustomer(row.id, date);
    if (result.success) {
      setCustomerIndent(result.data);
      setShowAddEditDialog(true);
    } else {
      showMessage("error", result.message);
    }
  };

  const openAddDialogHandler = () => {
    setShowAddEditDialog(true);
    setType("new");
  };
  const closeAddEditDialogHandler = () => {
    setShowAddEditDialog(false);
    setCustomerIndent([]);
    setType("");
  };
  const addIndentButtonHandler = (row) => {
    setRowData(row);
    openAddDialogHandler();
  };
  const getDateValue = (value) => {
    getIndentData(value);
  };

  // To save the newly added or edited indent
  const saveButtonHandler = async (indent) => {
    if (Object.keys(indent).length > 0) {
      closeAddEditDialogHandler();
      showLoader(true);
      const response = await fetch("http://localhost:3000/api/indent/save", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          orderInfo: { ...rowData, items: indent },
          type,
        }),
      });
      const result = await response.json();
      showLoader(false);
      if (result.success) {
        showMessage("success", result.message);
        getIndentData(date);
      } else {
        showMessage("error", result.message);
      }
    } else {
      showMessage("info", "Indent Not entered");
    }
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
          cancelButtonHandler={deleteIndent}
        />
      )}
      {showViewDialog && (
        <Modal
          dialogData={{
            title: `${rowData.customerName}'s Indent`,
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
            title: `${rowData.customerName}'s Indent`,
            desc: "",
            okButtonTitle: "OK",
            date: date,
          }}
          open={showAddEditDialog}
        >
          <NewIndent
            key={rowData.id}
            saveButtonHandler={saveButtonHandler}
            closeDialogHandler={closeAddEditDialogHandler}
            customerIndent={customerIndent}
          />
        </IndentDialog>
      )}
      <main>
        <div className="my-2 px-4 py-2 bg-secondary rounded-md flex justify-between">
          <h1 className="font-semibold">Indent : {date}</h1>
        </div>
        <section>
          <DataTable
            getDateValue={getDateValue}
            datePicker={{ show: true }}
            showFooter={true}
            renderRowActions={(row) =>
              actionButtons(
                row,
                deleteDialogHandler,
                viewDialogHandler,
                addIndentButtonHandler,
                editDialogHandler,
              )
            }
            filter={{
              searchPlaceholder: "Customer Name",
              filterColumn: "customerName",
            }}
            columns={columns}
            data={indent}
          />
        </section>
      </main>
    </>
  );
}

export default Indent;
