const { NextResponse } = require("next/server");
import getProductsInfo from "./util/productUtils";

export const GET = async () => {
  try {
    const result = await getProductsInfo();
    return NextResponse.json(result);
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
      error: e,
    });
  }
};
