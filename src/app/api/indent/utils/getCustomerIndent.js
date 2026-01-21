import getSheetData from "../../utils/getSheetData";

const getCustomerIndent = async (indentFilePath, indentSummary) => {
  const orderSummary = await getSheetData(indentFilePath);
  let indent;
  if (orderSummary.success) {
    if (orderSummary.data.length > 0) {
      indent = indentSummary.map((customerIndentSummary) => {
        const order = orderSummary.filter((order) => {
          if (order.id === customerIndentSummary.id) {
            let modifiedOrder = { ...order };
            delete modifiedOrder[id];
            return modifiedOrder;
          }
        });
        if (order.length > 0) {
          return { ...customerIndentSummary, items: order };
        }
      });
    } else {
      indentSummary = indentSummary.map((indent) => {
        return { ...indent, items: [] };
      });
    }
  }
  return indent;
};
export default getCustomerIndent;
