import * as supabaseProvider from "./providers/supabase/index";
import * as googleSheetsProvider from "./providers/sheets/index";

const provider = process.env.DB_PROVIDER || "google-sheets";

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
