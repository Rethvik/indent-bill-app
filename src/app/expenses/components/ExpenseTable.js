"use client";
import DataTable from "@/components/reusable/DataTable/DataTable";
import { de, se } from "date-fns/locale";
import actionButtons from "../data/actions";
import { Modal } from "@/components/reusable/Dialog/Modal";
import ExpenseForm from "./ExpenseForm";
import { useState } from "react";

const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "expenseName",
    header: "Expense Name",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "expenseCreatedAt",
    header: "Created At",
  },
];
// Generate sample data upto 5 entries using above columns schema
const sampleData = [
  {
    id: 1,
    expenseName: "Food",
    amount: 150.0,
    expenseCreatedAt: "2023-10-01",
  },
  {
    id: 2,
    expenseName: "Auto Maintainence",
    amount: 500.0,
    expenseCreatedAt: "2023-10-02",
  },
  {
    id: 3,
    expenseName: "Intertrip",
    amount: 500.0,
    expenseCreatedAt: "2023-10-02",
  },
];

const ExpenseDataTable = () => {
  const [expenses, setExpenses] = useState(sampleData);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showDeleteExpenseModal, setShowDeleteExpenseModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const total = expenses.reduce((sum, row) => sum + (row.amount || 0), 0);
  const getDateValue = (date) => {
    console.log(date);
  };
  const deleteExpenseHandler = (row) => {
    setRowData(row);
    setShowDeleteExpenseModal(true);
  };
  const closeDeleteExpenseModal = () => {
    setRowData({});
    setShowDeleteExpenseModal(false);
  };
  const editExpenseHandler = (row) => {
    setRowData(row);
    setShowExpenseModal(true);
  };
  const closeExpenseModal = () => {
    setShowExpenseModal(false);
  };
  const addExpenseButtonHandler = () => {
    setShowExpenseModal(true);
    setRowData({});
  };
  const deleteExpense = () => {
    const deleteExpenseId = rowData.id;
    setExpenses((prev) =>
      prev.filter((expense) => expense.id !== deleteExpenseId),
    );
    closeDeleteExpenseModal();
  };

  const saveNewExpenseHandler = (expenseData) => {
    const hasExpense = expenses.some(
      (expense) => String(expense.id) === String(expenseData.id),
    );
    if (hasExpense) {
      const modifiedExpenseData = expenses.map((expense) => {
        if (expense.id === expenseData.id) {
          return { ...expense, ...expenseData };
        } else {
          return expense;
        }
      });
      setExpenses(modifiedExpenseData);
      setShowExpenseModal(false);
      return;
    }
    setExpenses([
      ...expenses,
      {
        ...expenseData,
        id: expenses.length + 1,
        amount: Number(expenseData.amount),
        expenseCreatedAt: new Date().toISOString().split("T")[0],
      },
    ]);
    setShowExpenseModal(false);
  };
  return (
    <>
      <Modal
        open={showExpenseModal}
        dialogData={{
          title: `Add New Expense`,
          desc: "",
        }}
        style={{ width: "800px", maxWidth: "100vw", minHeight: "200px" }}
        closeDialogHandler={closeExpenseModal}
      >
        <ExpenseForm row={rowData} expenseSaveHandler={saveNewExpenseHandler} />
      </Modal>
      {showDeleteExpenseModal && (
        <Modal
          dialogData={{
            title: "Delete Confirmation",
            desc: "Are you sure, you want to delete",
            cancelButtonTitle: "Yes",
            okButtonTitle: "No",
          }}
          open={showDeleteExpenseModal}
          closeDialogHandler={closeDeleteExpenseModal}
          cancelButtonHandler={deleteExpense}
        />
      )}
      <div>
        <DataTable
          button={{
            show: true,
            label: "Add Expense",
            variant: "purple",
            onClick: addExpenseButtonHandler,
          }}
          datePicker={{ show: true }}
          getDateValue={getDateValue}
          data={expenses}
          columns={columns}
          showFooter={true}
          footerContent={{ total, colSpan: 2 }}
          renderRowActions={(row) =>
            actionButtons(row, deleteExpenseHandler, editExpenseHandler)
          }
        />
      </div>
    </>
  );
};
export default ExpenseDataTable;
