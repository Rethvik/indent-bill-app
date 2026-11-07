import * as supabaseProvider from "./providers/supabase/index";
import * as googleSheetsProvider from "./providers/sheets/index";

// While changing provider, make sure to change secondary as well
const provider = process.env.DB_PROVIDER || "google-sheets";

const secondary = googleSheetsProvider;

function getProvider() {
  if (provider === "supabase") return [supabaseProvider];
  if (provider === "google-sheets") return [googleSheetsProvider];
  if (provider === "both") return [supabaseProvider, googleSheetsProvider];
}

export async function getCustomers() {
  const providers = getProvider();
  const [primary] = providers;
  const result = await primary.getCustomers();
  return result;
}

export async function getProducts() {
  const providers = getProvider();
  const [primary] = providers;
  const result = await primary.getProducts();
  return result;
}

export async function getSuppliers() {
  const providers = getProvider();
  const [primary] = providers;
  const result = await primary.getSuppliers();
  return result;
}

export async function getIndent(selectedDate) {
  const providers = getProvider();
  const [primary] = providers;
  const result = await primary.getIndent(selectedDate);
  return result;
}

export async function getPurchase(selectedDate) {
  const providers = getProvider();
  const [primary] = providers;
  const result = await primary.getPurchase(selectedDate);
  return result;
}

export async function createOrderLib(order, tableName, date) {
  const providers = getProvider();
  const [primary] = providers;
  const result = await primary.createOrderLib(order, tableName, date);
  // secondary.createOrder(order, tableName);
  return result;
}

export async function getPriceListLib(data) {
  const providers = getProvider();
  const [primary] = providers;
  const result = await primary.getPriceListLib(data);
  return result;
}
