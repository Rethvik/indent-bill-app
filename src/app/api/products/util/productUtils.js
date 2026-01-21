import { getMetadata, updateMetaData } from "../../utils/metaData";
import { createExcelFile } from "../../utils/checkFile";
import SERVER_CONSTANTS from "../../constants/apiConstant";
import fs from "fs/promises";
import fileSystem from "fs";
import * as XLSX from "xlsx";
import logger from "../../utils/log";
import { getListOfProducts } from "../../swipe";
const productResult = {
  success: true,
  message: "",
  error_code: "",
  errors: {},
  data: {
    items: [
      {
        id: "1",
        name: "FCM",
        quantity: 48,
        unit_price: 100,
        price_with_tax: 118,
        item_type: "Product",
        tax_rate: 18,
        discount_percent: 10,
        description: false,
        hsn_code: "1234",
        unit: "LTRS",
        category: "PACKETS",
        swipe_id: "1",
      },
      {
        id: "2",
        name: "STD",
        quantity: 36,
        unit_price: 100,
        price_with_tax: 118,
        item_type: "Product",
        tax_rate: 18,
        discount_percent: 10,
        description: false,
        hsn_code: "1234",
        unit: "LTRS",
        category: "PACKETS",
        swipe_id: "2",
      },
      {
        id: "3",
        name: "CURD 425GMS",
        quantity: 78,
        unit_price: 100,
        price_with_tax: 118,
        item_type: "Product",
        tax_rate: 18,
        discount_percent: 10,
        description: false,
        hsn_code: "1234",
        unit: "GMS",
        category: "PACKETS",
        swipe_id: "3",
      },
      {
        id: "4",
        name: "PANEER 200GMS",
        quantity: 10,
        unit_price: 100,
        price_with_tax: 118,
        item_type: "Product",
        tax_rate: 18,
        discount_percent: 10,
        description: false,
        hsn_code: "1234",
        unit: "GMS",
        category: "PACKETS",
        swipe_id: "4",
      },
      {
        id: "5",
        name: "PANEER 1KG",
        quantity: 5,
        unit_price: 390,
        price_with_tax: 390,
        item_type: "Product",
        tax_rate: 0,
        discount_percent: 0,
        description: false,
        hsn_code: "1234",
        unit: "KGS",
        category: "PACKETS",
        swipe_id: "5",
      },
      {
        id: "6",
        name: "BUFF GHEE 950ML",
        quantity: 12,
        unit_price: 590,
        price_with_tax: 610,
        item_type: "Product",
        tax_rate: 5,
        discount_percent: 0,
        description: false,
        hsn_code: "1234",
        unit: "ML",
        category: "PACKETS",
        swipe_id: "6",
      },
      {
        id: "7",
        name: "BUFF GHEE 475ML",
        quantity: 24,
        unit_price: 305,
        price_with_tax: 315,
        item_type: "Product",
        tax_rate: 5,
        discount_percent: 0,
        description: false,
        hsn_code: "1234",
        unit: "ML",
        category: "PACKETS",
        swipe_id: "7",
      },
      {
        id: "8",
        name: "CREAM CURD 500GMS",
        quantity: 24,
        unit_price: 35,
        price_with_tax: 35,
        item_type: "Product",
        tax_rate: 5,
        discount_percent: 0,
        description: true,
        hsn_code: "1234",
        unit: "GMS",
        category: "PACKETS",
        swipe_id: "8",
      },
    ],
    total_records: 10,
  },
};
const productsFilePath = `${SERVER_CONSTANTS.PRODUCTS_FILE_PATH}/products.xlsx`;

const productSWIPEAPI = async () => {
  // Call the API, until then hardcoded result
  // CALL PRODUCTS SWIPE API HERE
  // ALL DATA MANIPULATION SHOULD BE DONE HERE
  const productsListResp = await getListOfProducts();
  console.log(productsListResp);
  if (productsListResp.success) {
    const products = productsListResp.data.items.map((product) => {
      return {
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        basePrice: product.unit_price,
        priceWithTax: product.price_with_tax,
        taxRate: product.tax_rate,
        description: product.description,
        hsnCode: product.hsn_code,
        unit: product.unit,
        swipeId: product.swipe_id,
        discountPercent: product.discount_percent,
      };
    });
    return {
      success: true,
      products,
    };
  } else {
    return { ...productsListResp, showMessage: true };
  }
};

const checkProductsFile = async () => {
  try {
    await fs.access(SERVER_CONSTANTS.PRODUCTS_FILE_PATH);
  } catch {
    await fs.mkdir(SERVER_CONSTANTS.PRODUCTS_FILE_PATH, { recursive: true });
  }
  try {
    await fs.access(productsFilePath);
    return { success: true, message: "File Found" };
  } catch {
    const result = await createExcelFile([], "PRODUCTS", productsFilePath);

    // Here we need to call swipe API and pass the products into loadProducts

    if (result.success) {
      const productData = await productSWIPEAPI();
      if (productData.success) {
        await loadProducts(productData.products);
      } else {
        return productData;
      }
      return { success: true, message: "Excel Created" };
    } else {
      return { success: false, message: result.message };
    }
  }
};
// This is to load the products
const loadProducts = async (data) => {
  try {
    XLSX.set_fs(fileSystem);
    const workbook = XLSX.readFile(productsFilePath);
    let worksheet;
    if (workbook.SheetNames.includes("PRODUCTS")) {
      worksheet = workbook.Sheets["PRODUCTS"];
      const newWorksheet = XLSX.utils.json_to_sheet(data);
      workbook.Sheets["PRODUCTS"] = newWorksheet;
    } else {
      worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, "PRODUCTS");
    }
    await XLSX.writeFile(workbook, productsFilePath);
    await updateMetaData(productsFilePath);
    return {
      success: true,
      message: "Products Fetched Success",
      products: data,
    };
  } catch (e) {
    console.log(e);
  }
};
const getProducts = async () => {
  try {
    const result = await checkProductsFile();
    if (result.success) {
      const metadata = await getMetadata(productsFilePath);
      let lastUpdated;
      if (metadata.data.length > 0) {
        lastUpdated = metadata.data[0]["LastUpdated"];
      } else {
        lastUpdated = 0;
      }
      logger(
        "success",
        `Products Last Updated At ${new Date(lastUpdated).toLocaleString()}`,
      );
      const currentDate = new Date();
      const diffMs = currentDate - lastUpdated;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      if (hours > SERVER_CONSTANTS.PRODUCT_TIME_UPDATION) {
        /*
            -> then we need to call the SWIPE API.
            -> After calling SWIPE API, data need to be updated in excel and also last updated information.
        */
        const productsResult = await productSWIPEAPI();
        if (productsResult.success) {
          const result = await loadProducts(productsResult.products);
          return result;
        }
      } else {
        const workbook = XLSX.readFile(productsFilePath);
        const worksheet = workbook.Sheets["PRODUCTS"];
        const existingData = XLSX.utils.sheet_to_json(worksheet);
        return {
          success: true,
          message: "Products Fetched Successfully",
          products: existingData,
          showMessage: true,
        };
      }
    } else {
      return { success: false, message: "Products File Not Present" };
    }
  } catch (e) {
    logger("error", e);
    return { success: false, message: e.message, error: e };
  }
};

export { getProducts };
