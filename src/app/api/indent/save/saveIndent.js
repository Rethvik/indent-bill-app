import APP_CONSTANT from "@/consts/appConstants";
import getSheetData from "../../utils/getSheetData";
import writeSheetData from "../../utils/writeSheetData";
import logger from "../../utils/log";
// data {
//   id: 1,
//   customerName: 'Vanapalli 3',
//   status: 'Not Ordered',
//   contact: '1234567890',
//   items: { FCM: '12' }
// }
// [
//   {
//     id: 1,
//     customerName: "Vanapalli 3",
//     status: "Not Ordered",
//     contact: "1234567890",
//   },
//   {
//     id: 2,
//     customerName: "Siva",
//     status: "Not Ordered",
//     contact: "123456678",
//   },
//   {
//     id: 3,
//     customerName: "Yenugu Mahal 2",
//     status: "Not Ordered",
//     contact: "9878748392",
//   },
//   {
//     id: 4,
//     customerName: "Kattunga Srinu",
//     status: "Not Ordered",
//     contact: "989880988",
//   },
//   {
//     id: 5,
//     customerName: "D Suri",
//     status: "Not Ordered",
//     contact: "7878980988",
//   },
// ];
const saveIndent = async (indentFilePath, data) => {
  try {
    const indentSummary = await getSheetData(indentFilePath, "INDENT");
    const totalOrderSummary = await getSheetData(indentFilePath, "ORDER");
    if (indentSummary.success) {
      if (totalOrderSummary.success) {
        let orderData = totalOrderSummary.data;
        orderData = orderData.filter((order) => order.id != data.id);
        orderData = [...orderData, { id: data.id, ...data.items }];
        const result = await writeSheetData(indentFilePath, "ORDER", orderData);
        if (result.success) {
          let customersStatusData = indentSummary.data;
          customersStatusData = customersStatusData.map((detail) => {
            if (detail.id === data.id) {
              detail.status = APP_CONSTANT.ORDERED;
              return detail;
            } else {
              return detail;
            }
          });
          const indentResult = await writeSheetData(
            indentFilePath,
            "INDENT",
            customersStatusData
          );
          return indentResult;
        }
        return result;
      } else {
        logger("error", totalOrderSummary);
        return totalOrderSummary;
      }
    } else {
      logger("error", indentSummary);
      return indentSummary;
    }
  } catch (e) {
    logger("error", e);
  }
};
export default saveIndent;
