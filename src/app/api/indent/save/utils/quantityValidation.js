const quantityValidation = (items) => {
  const filteredItems = items.filter((item) => Number(item.quantity <= 0));
  if (filteredItems.length > 0) {
    return {
      success: false,
      message: "Quantity should be greater than 0 for all items.",
      showMessage: true,
    };
  } else {
    return {
      success: true,
      message: "Quantity validation successful.",
      showMessage: false,
    };
  }
};
export default quantityValidation;
