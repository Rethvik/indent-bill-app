"use client";
import DataTable from "@/components/reusable/DataTable/DataTable";
import React, { useCallback, useRef, useState } from "react";
import columns from "./data/columns";
import indentData from "./data/indentData";
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
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [rowData, setRowData] = useState({});
  const [indent, setIndent] = useState([]);
  const [viewData, setViewData] = useState([]);
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
  const viewDialogHandler = async (row) => {
    setRowData(row);
    setShowViewDialog((prev) => !prev);
    const id = { id: row.id, date };
    const params = new URLSearchParams(id);
    const response = await fetch(
      `http://localhost:3000/api/indent/get?${params}`,
      { method: "GET" },
    );
    const result = await response.json();
    if (result.success) {
      setViewData(result.data);
    } else {
      showMessage("error", result.message);
      setViewData([]);
    }
  };
  const closeViewDialogHandler = () => {
    setShowViewDialog(false);
  };

  const deleteDialogHandler = (row) => {
    setRowData(row);
    setShowDeleteDialog(true);
  };
  const closeDeleteDialogHandler = () => {
    setShowDeleteDialog(false);
  };

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

  const addDialogHandler = (row) => {
    setRowData(row);
    setShowAddDialog((prev) => !prev);
  };

  const getDateValue = (value) => {
    getIndentData(value);
  };
  const saveButtonHandler = async (indent) => {
    console.log(indent);
    addDialogHandler();
    showLoader(true);
    const response = await fetch("http://localhost:3000/api/indent/save", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date, data: { ...rowData, items: indent } }),
    });
    const result = await response.json();
    showLoader(false);
    if (result.success) {
      showMessage("success", result.message);
      getIndentData(date);
    } else {
      showMessage("error", result.message);
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
      {showAddDialog && (
        <IndentDialog
          dialogData={{
            title: `${rowData.customerName}'s Indent`,
            desc: "",
            okButtonTitle: "OK",
          }}
          open={showAddDialog}
        >
          <NewIndent
            saveButtonHandler={saveButtonHandler}
            closeDialogHandler={addDialogHandler}
          />
        </IndentDialog>
      )}
      <main>
        <div className="my-2 px-4 py-2 bg-secondary rounded-md">
          <h1 className="font-semibold">Indent</h1>
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
                addDialogHandler,
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
