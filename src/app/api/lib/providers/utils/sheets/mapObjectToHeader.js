import convertDateToIST from "@/app/api/utils/convertDateToIST";

/**
 * Maps an arbitrary data object to a row array matching the sheet's header order.
 * Missing fields become empty strings; extra object fields not in headers are ignored.
 */
function mapObjectToRow(headers, dataObj) {
  return headers.map((header) => {
    if (header === "created_at" && dataObj.created_at === undefined) {
      return convertDateToIST();
    }
    if (header === "updated_at") {
      return convertDateToIST();
    }
    const value = dataObj[header];
    return value === undefined || value === null ? "" : value;
  });
}
export default mapObjectToRow;
