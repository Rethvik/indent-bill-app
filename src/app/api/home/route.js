import { NextResponse } from "next/server";
import { getSheetClient } from "../google-sheets/getSheetClient";
export async function GET() {
  const spreadSheetId = "1PsaMK2Myc180QGQLbJCvVVctnywBdyS2k_ZMO6nw3N4";
  const sheets = await getSheetClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadSheetId,
    range: "Sheet1",
  });
  const rows = response.data.values;
  console.log(rows);
  const headers = rows[0];
  const records = rows.slice(1).map((row) => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] !== undefined ? row[i] : "";
    });
    return obj;
  });

  console.log({ headers, records });
  return NextResponse.json({ message: "From Home Page" });
}
