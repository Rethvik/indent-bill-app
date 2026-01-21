'use client';

import { useEffect } from "react";
import { setupInterceptors } from "@/lib/api";

export default function Providers({ children }) {
  useEffect(() => {
    console.log("Interceptor initialized");
    setupInterceptors();
  }, []);

  return children;
}
