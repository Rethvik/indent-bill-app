import APP_CONSTANT from "@/consts/appConstants";
import getSheetData from "../../utils/getSheetData";
import writeSheetData from "../../utils/writeSheetData";

const deleteIndent = async (indentFilePath, id) => {
  try {
    const orderData = await getSheetData(indentFilePath, "ORDER");
    if (orderData.success) {
      const totalIndent = orderData.data;
      const modifiedIndent = totalIndent.filter((indent) => indent.id !== id);
      const indentStatus = await getSheetData(indentFilePath, "INDENT");
      if (indentStatus.success) {
        const statusData = indentStatus.data;
        const modifiedStatusData = statusData.map((item) => {
          if (item.id === id) {
            item.status = APP_CONSTANT.NOT_ORDERED;
            return item;
          } else {
            return item;
          }
        });
        const indentUpdated = await writeSheetData(
          indentFilePath,
          "ORDER",
          modifiedIndent,
        );
        const orderUpdated = await writeSheetData(
          indentFilePath,
          "INDENT",
          modifiedStatusData,
        );
        return { success: true, message: "Indent Deleted Successfully" };
      } else {
        return indentStatus;
      }
    } else {
      return orderData;
    }
  } catch (err) {
    console.log(err);
    return { success: false, error: err, message: err.message };
  }
};
export default deleteIndent;
