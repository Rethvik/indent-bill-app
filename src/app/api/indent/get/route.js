import { NextResponse } from "next/server";
import getSheetData from "../../utils/getSheetData";
import getDateFilePath from "../../utils/getDateFilePath";

export async function GET(req, res) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const date = searchParams.get("date");
    const indentFilePath = getDateFilePath(date);
    const indentData = await getSheetData(indentFilePath, "ORDER");
    const customerIndent = indentData.data.filter(
      (indent) => indent.id === id,
    )[0];
    const ignoreFields = ["id", "__rowNum__"];
    const indentKeys = Object.keys(customerIndent);
    let data = [];
    for (let i = 0; i < indentKeys.length; i++) {
      if (!ignoreFields.includes(indentKeys[i])) {
        data = [
          ...data,
          { product: indentKeys[i], quantity: customerIndent[indentKeys[i]] },
        ];
      }
    }
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err,
      message: err.message,
    });
  }
}
