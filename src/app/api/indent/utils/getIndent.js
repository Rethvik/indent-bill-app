import { checkFile } from "../../utils/checkFile";
import { getCustomers } from "../../customers/loadCustomers";
import indentLedger from "./indent";
import getDateFilePath from "../../utils/getDateFilePath";
import getSheetData from "../../utils/getSheetData";
import * as XLSX from "xlsx";
import writeSheetData from "../../utils/writeSheetData";

const getIndent = async (indentDate) => {
  try {
    const result = await checkFile();
    // Fetch Customers
    if (result.success) {
      const customersResult = await getCustomers();
      // console.log(customersResult);
      if (customersResult.success) {
        // Get filePath and respective data
        const indentFilePath = getDateFilePath(indentDate);
        const result = await getSheetData(indentFilePath, "INDENT");
        if (result.success) {
          /*
            1. If Indent present, then we need to compare the customers we fetched and customers from indent file.
            2. If new Customer is present we need to add that customer into the indent file.
          */
          if (result.data.length > 0) {
            /* 
              Here we need to check the customers present in excel and file and data got from getCustomers
              If customer count is different we need to add new customer and make status indent placed to False
            */
            const existingCustomers = result.data.map(
              (customer) => customer.id,
            );
            const newCustomers = customersResult.customers
              .filter(
                (customer) => !existingCustomers.includes(customer.customer_id),
              )
              .map((customer) => {
                return {
                  id: customer.customer_id,
                  customerName: customer.name,
                  status: "Not Ordered",
                  contact: customer.phone,
                };
              });
            if (newCustomers.length > 0) {
              const writeResult = await writeSheetData(
                indentFilePath,
                "INDENT",
                [...result.data, ...newCustomers],
              );
              if (writeResult.success) {
                return {
                  success: true,
                  message: "Indent fetched successfully",
                  indent: [...result.data, ...newCustomers],
                };
              } else {
                return writeResult;
              }
            } else {
              return {
                success: true,
                message: "Indent fetched successfully",
                indent: result.data,
              };
            }
          } else {
            // Here we need to load the customers into indent file
            const data = customersResult.customers.map((customer) => {
              return {
                id: customer.customer_id,
                customerName: customer.name,
                status: "Not Ordered",
                contact: customer.phone,
              };
            });
            const workbook = result.workbook;
            const newWorksheet = XLSX.utils.json_to_sheet(data);
            workbook.Sheets["INDENT"] = newWorksheet;
            await XLSX.writeFile(workbook, indentFilePath);
            return {
              success: true,
              message: "Indent created successfully",
              indent: data,
            };
          }
        } else {
          return result;
        }
      } else {
        return customersResult;
      }
    } else {
      return result;
    }
  } catch (err) {
    console.log(err);
    return { success: false, err, message: err.message };
  }
};
export default getIndent;
