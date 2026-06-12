import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";
import logger from "../log";

export default async function savePdf({ fileName, directory, onBuild }) {
  try {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    const filePath = path.join(directory, fileName);
    const pdfDoc = await PDFDocument.create();
    const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helpers = { pdfDoc, regular, bold, rgb };

    // Caller builds the content
    await onBuild(helpers);

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(filePath, pdfBytes);
    logger("success", `PDF saved successfully`);
    return { success: true, filePath };
  } catch (err) {
    logger("error", `Error in saving pdf ${err.message}`);
    return { success: false, message: err.message, showMessage: true };
  }
}
