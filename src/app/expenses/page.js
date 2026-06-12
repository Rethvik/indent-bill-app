import React from "react";
import ExpenseDataTable from "./components/ExpenseTable";

const Expenses = () => {
  return (
    <main>
      <div className="my-2 mb-3 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">Expenses</h1>
      </div>
      <section>
        <ExpenseDataTable />
      </section>
    </main>
  );
};
export default Expenses;
