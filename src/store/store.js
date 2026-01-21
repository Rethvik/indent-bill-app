"use-client";
import { create } from "zustand";
import { toast } from "sonner";
import { persist } from "zustand/middleware";

const useSelectedProducts = create((set) => ({
  products: [],
  updateProducts: (selected) => set({ products: [...selected] }),
}));

const useShowLoader = create((set) => ({
  loader: false,
  showLoader: (show) => set({ loader: show }),
}));

const useShowMessage = create(() => ({
  showMessage: (variant = "", message) =>
    toast[variant](message, {
      action: { label: "X", onClick: () => toast.dismiss() },
    }),
}));

const useIndentSelectedDate = create((set) => ({
  date: "",
  updateDate: (selectedDate) => set({ date: selectedDate }),
}));

const useProducts = create(
  persist(
    (set, get) => ({
      products: [],
      loading: false,
      error: null,
      message: "",

      fetchProducts: async (force = false) => {
        if (get().products.length > 0 && !force) return;

        set({ loading: true, error: null });

        try {
          const res = await fetch("http://localhost:3000/api/products");
          const data = await res.json();

          if (data.success) {
            set({
              products: data.products,
              loading: false,
              message: data.message,
            });
          } else {
            set({
              error: data.message,
              loading: false,
              message: data.message,
            });
          }
        } catch (e) {
          console.error(e);
          set({
            error: e,
            loading: false,
            message: e.message,
          });
        }
      },

      clearProducts: () => set({ products: [] }),
    }),
    {
      name: "product-store",
      partialize: (state) => ({ products: state.products }),
    }
  )
);

export {
  useSelectedProducts,
  useShowLoader,
  useShowMessage,
  useProducts,
  useIndentSelectedDate,
};
