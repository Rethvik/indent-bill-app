import SERVER_CONSTANTS from "@/app/api/constants/apiConstant";
import convertDateToFileFormat from "@/app/api/utils/convertDateToFileFormat";
import logger from "@/app/api/utils/log";
import savePdf from "@/app/api/utils/pdf/savePdf";
const savePaymentPdf = async ({ paymentsData, date }) => {
  try {
    const { year, monthName } = convertDateToFileFormat(date);
    const fileName = `Payment-Summary-${date}.pdf`;
    const directory = `${SERVER_CONSTANTS.PAYMENTS_FOLDER_PATH}/${year}/${monthName}`;
    const onBuild = async ({ pdfDoc, regular, bold, rgb }) => {
      const ROW_H = 30;
      const FONT_SIZE = 10;
      const addPage = () => {
        const page = pdfDoc.addPage([595, 842]);
        return { page, y: page.getSize().height - 40 };
      };
      let { page, y } = addPage();
      const width = 595;
      // Helper to check and add new page if needed
      const checkPage = (neededHeight = 20) => {
        if (y < 60 + neededHeight) {
          ({ page, y } = addPage());
        }
      };
      const fmt = (n) => "Rs. " + Number(n).toLocaleString("en-IN");

      // ── Header ──────────────────────────────────
      const title = "SAI TEJA MILK DAIRY";
      const titleWidth = bold.widthOfTextAtSize(title, 20);
      page.drawText(title, {
        x: (width - titleWidth) / 2,
        y,
        font: bold,
        size: 18,
        color: rgb(0, 0, 0),
      });
      y -= 18;
      page.drawLine({
        start: { x: 40, y },
        end: { x: width - 40, y },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
      y -= 25;
      // ── Title ───────────────────────────────────
      page.drawText("Daily Payment Summary", {
        x: 40,
        y,
        font: bold,
        size: 13,
        color: rgb(0, 0, 0),
      });
      y -= 16;
      page.drawText(`Date: ${date}`, {
        x: 40,
        y,
        font: regular,
        size: 9.5,
        color: rgb(0.33, 0.33, 0.33),
      });
      page.drawText(`Total Customers: ${paymentsData.length}`, {
        x: width - 150,
        y,
        font: regular,
        size: 9.5,
        color: rgb(0.33, 0.33, 0.33),
      });
      y -= 30;
      // ── Table Header ────────────────────────────
      const cols = [45, 80, 330, 460];
      const heads = ["#", "Customer", "Bill", "Received"];

      const drawTableHeader = () => {
        page.drawRectangle({
          x: 40,
          y: y - 4,
          width: width - 80,
          height: 20,
          color: rgb(0.8, 0.35, 0.1),
        });
        heads.forEach((h, i) => {
          page.drawText(h, {
            x: cols[i],
            y: y + 2,
            font: bold,
            size: 11,
            color: rgb(1, 1, 1),
          });
        });
        y -= 24;
      };

      drawTableHeader();

      // ── Table Rows ──────────────────────────────
      paymentsData.forEach((c, i) => {
        checkPage(ROW_H); // ensure space before drawing row

        // If new page was added, redraw header
        if (y === page.getSize().height - 40) drawTableHeader();

        if (c.paymentReceived === 0) {
          // Red background for unpaid rows
          page.drawRectangle({
            x: 40,
            y: y - ROW_H + FONT_SIZE,
            width: width - 80,
            height: ROW_H,
            color: rgb(0.98, 0.9, 0.9), // light red
          });
        } else if (i % 2 !== 0) {
          // Alternating grey for paid rows
          page.drawRectangle({
            x: 40,
            y: y - ROW_H + FONT_SIZE,
            width: width - 80,
            height: ROW_H,
            color: rgb(0.976, 0.976, 0.976),
          });
        }
        const textY = y - ROW_H / 2 + FONT_SIZE / 2;
        const row = [
          String(c.customer_id),
          c.name,
          fmt(c.totalAmount),
          fmt(c.paymentReceived),
        ];

        row.forEach((val, j) => {
          page.drawText(val, {
            x: cols[j],
            y: textY,
            font: regular,
            size: FONT_SIZE,
            color: rgb(0.2, 0.2, 0.2),
          });
        });

        page.drawLine({
          start: { x: 40, y: y - ROW_H + FONT_SIZE },
          end: { x: width - 40, y: y - ROW_H + FONT_SIZE },
          thickness: 0.5,
          color: rgb(0.88, 0.88, 0.88),
        });

        y -= ROW_H;
      });
      // ── Summary Box ─────────────────────────────
      checkPage(70);
      const totalBill = paymentsData.reduce((s, c) => s + c.totalAmount, 0);
      const totalReceived = paymentsData.reduce(
        (s, c) => s + c.paymentReceived,
        0,
      );

      y -= 14;

      // Total Bill row
      page.drawRectangle({
        x: 40,
        y: y - ROW_H + FONT_SIZE,
        width: width - 80,
        height: ROW_H,
        color: rgb(0.96, 0.96, 0.96),
      });
      const billTextY = y - ROW_H / 2 + FONT_SIZE / 2;
      page.drawText("Total Bill", {
        x: cols[1],
        y: billTextY,
        font: bold,
        size: FONT_SIZE,
        color: rgb(0.2, 0.2, 0.2),
      });
      page.drawText(fmt(totalBill), {
        x: cols[2],
        y: billTextY,
        font: bold,
        size: FONT_SIZE,
        color: rgb(0.2, 0.2, 0.2),
      });
      page.drawLine({
        start: { x: 40, y: y - ROW_H + FONT_SIZE },
        end: { x: width - 40, y: y - ROW_H + FONT_SIZE },
        thickness: 0.5,
        color: rgb(0.88, 0.88, 0.88),
      });
      y -= ROW_H;

      // Total Received row
      page.drawRectangle({
        x: 40,
        y: y - ROW_H + FONT_SIZE,
        width: width - 80,
        height: ROW_H,
        color: rgb(0.92, 0.96, 0.92), // light green to distinguish
      });
      const receivedTextY = y - ROW_H / 2 + FONT_SIZE / 2;
      page.drawText("Total Received", {
        x: cols[1],
        y: receivedTextY,
        font: bold,
        size: FONT_SIZE,
        color: rgb(0.2, 0.2, 0.2),
      });
      page.drawText(fmt(totalReceived), {
        x: cols[2],
        y: receivedTextY,
        font: bold,
        size: FONT_SIZE,
        color: rgb(0.15, 0.5, 0.2),
      });
      page.drawLine({
        start: { x: 40, y: y - ROW_H + FONT_SIZE },
        end: { x: width - 40, y: y - ROW_H + FONT_SIZE },
        thickness: 0.5,
        color: rgb(0.88, 0.88, 0.88),
      });
      y -= ROW_H;

      // ── Footer ──────────────────────────────────
      page.drawText(
        `Generated on ${new Date().toLocaleString("en-IN")} · SAI TEJA MILK DAIRY`,
        { x: 40, y: 30, font: regular, size: 9, color: rgb(0.67, 0.67, 0.67) },
      );
      page.drawText(
        `Generated on ${new Date().toLocaleString("en-IN")} · SAI TEJA MILK DAIRY`,
        { x: 40, y: 30, font: regular, size: 9, color: rgb(0.67, 0.67, 0.67) },
      );
    };
    const result = await savePdf({ fileName, directory, onBuild });
    return result;
  } catch (err) {
    logger("error", `Error in saving payment pdf ${err.message}`);
    return { success: false, message: err.message, showMessage: true };
  }
};
export default savePaymentPdf;
