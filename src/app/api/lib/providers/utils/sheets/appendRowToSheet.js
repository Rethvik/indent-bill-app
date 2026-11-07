import logger from "@/app/api/utils/log";

async function appendRow({ sheets, spreadSheetId, sheetName, rowValues }) {
  try {
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: spreadSheetId,
      range: `${sheetName}!A1`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [rowValues] },
    });
    if (result.status === 200) {
      return { success: true, result };
    }
  } catch (err) {
    logger("error", `Error appending row in sheets: ${err.message}`);
    return {
      success: false,
      error: err,
      message: err.message,
      showMessage: true,
    };
  }
}
export default appendRow;
