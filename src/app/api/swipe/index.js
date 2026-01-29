import logger from "../utils/log";

const bearerToken = "";
const getListOfCustomers = async () => {
  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${bearerToken}` },
  };
  try {
    const response = await fetch(
      "https://app.getswipe.in/api/partner/v2/customer/list?page=1",
      options,
    );
    const result = await response.json();
    if (result.success) {
      return result;
    } else {
      return { success: false, message: result.message };
    }
  } catch (err) {
    console.log("ERROR IN FETCHING CUSTOMERS SWIPE API", err);
    logger("error", err.message);
    return { success: false, error: err, message: err.message };
  }
};

const getListOfProducts = async () => {
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };
  try {
    const response = await fetch(
      "https://app.getswipe.in/api/partner/v2/product/list?page=1",
      options,
    );
    const result = await response.json();
    if (result.success) {
      return result;
    } else {
      return { success: false, message: result.message };
    }
  } catch (err) {
    console.log("ERROR IN FETCHING PRODUCTS SWIPE API", err);
    logger("error", err.message);
    return { success: false, error: err, message: err.message };
  }
};

const createInvoice = async (data) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      document_type: data.documentType,
      document_date: data.documentDate,
      party: {
        id: data.customerID,
        type: "customer",
        name: data.customerName,
        phone_number: data.customerPhone,
        gstin: data.gstIn,
      },
      notes: "Notes for the document",
      terms: "Terms and Conditions",
      items: [
        ...data.items,
        {
          id: "ITEM123455667ghg",
          name: "Item Namgergggree",
          quantity: 1,
          unit_price: 200,
          tax_rate: 18,
          price_with_tax: 236,
          net_amount: 200,
          total_amount: 236,
          hsn_code: "1234",
          item_type: "Product",
          unit: "kg",
          category: "Electronics",
        },
      ],
    }),
  };

  fetch("https://app.getswipe.in/api/partner/v2/doc", options)
    .then((res) => res.json())
    .then((res) => console.log(res))
    .catch((err) => console.error(err));
};

export { getListOfCustomers, getListOfProducts };
