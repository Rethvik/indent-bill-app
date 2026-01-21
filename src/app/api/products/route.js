const { NextResponse } = require("next/server");
const { getProducts } = require("./util/productUtils");

export const GET = async () => {
  try {
    const result = await getProducts();
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
