import PlainTable from "@/components/reusable/Table/PlainTable";
import React from "react";
// const data = [
//   {
//     product: "CURD 500 ML",
//     quantity: 300,
//     unit: "ML",
//   },
//   {
//     product: "TONED MILK 500 ML",
//     quantity: 1200,
//     unit: "ML",
//   },
//   {
//     product: "TONED MILK 1 LTR",
//     quantity: 800,
//     unit: "LTR",
//   },
//   {
//     product: "GHEE 1 LTR",
//     quantity: 150,
//     unit: "LTR",
//   },
//   {
//     product: "GHEE 500 ML",
//     quantity: 250,
//     unit: "ML",
//   },
//   {
//     product: "PANEER 200 GRAMS",
//     quantity: 400,
//     unit: "GRAMS",
//   },
//   {
//     product: "PANEER 500 GRAMS",
//     quantity: 180,
//     unit: "GRAMS",
//   },
//   {
//     product: "BUTTER 100 GRAMS",
//     quantity: 350,
//     unit: "GRAMS",
//   },
//   {
//     product: "BUTTER 500 GRAMS",
//     quantity: 90,
//     unit: "GRAMS",
//   },
//   {
//     product: "FLAVOURED MILK BADAM",
//     quantity: 600,
//     unit: "ML",
//   },
//   {
//     product: "FLAVOURED MILK STRAWBERRY",
//     quantity: 450,
//     unit: "ML",
//   },
//   {
//     product: "FLAVOURED MILK CHOCOLATE",
//     quantity: 700,
//     unit: "ML",
//   },
//   {
//     product: "LASSI SWEET 200 ML",
//     quantity: 550,
//     unit: "ML",
//   },
//   {
//     product: "LASSI MASALA 200 ML",
//     quantity: 520,
//     unit: "ML",
//   },
//   {
//     product: "DAHI 200 GRAMS",
//     quantity: 480,
//     unit: "GRAMS",
//   },
// ];
const tableHeaders = [
  { accessorKey: "name", title: "Product Name" },
  { accessorKey: "quantity", title: "Quantity" },
  { accessorKey: "unit", title: "Unit" },
  { accessorKey: "total_amount", title: "Amount" },
  { accessorKey: "crates", title: "Crates" },
];

function ViewIndent({ data }) {
  const totalAmount = +parseFloat(
    data.reduce((acc, current) => {
      return acc + current.total_amount;
    }, 0),
  ).toFixed(0);
  const totalCrates = data.reduce((acc, current) => {
    return acc + current.crates;
  }, 0);
  return (
    <>
      <PlainTable
        data={data}
        tableHeaders={tableHeaders}
        totalAmount={totalAmount}
        totalCrates={totalCrates}
      />
    </>
  );
}

export default ViewIndent;
