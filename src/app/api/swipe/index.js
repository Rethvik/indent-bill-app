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
  try {
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        document_type: data.documentType,
        document_date: data.documentDate,
        serial_number_v2: {
          prefix: `SAITEJA/${data.documentDate.split("-")[2]}/`,
        },
        party: {
          id: data.party.id,
          type: "customer",
          name: data.party.name,
          phone_number: data.phone_number,
          gstin: data.party.gstin,
        },
        terms:
          "Products need to checked at vehicle only. After vehicle left any damages are not our responsible",
        items: [...data.items],
      }),
    };

    const response = await fetch(
      "https://app.getswipe.in/api/partner/v2/doc",
      options,
    );
    const result = await response.json();
    return result;
  } catch (err) {
    logger("error", err.message);
    return { success: false, error: err, message: err.message };
  }
};

export { getListOfCustomers, getListOfProducts, createInvoice };
