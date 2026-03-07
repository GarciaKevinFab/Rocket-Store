import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts } from "../services/productService";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (filters = {}) => {
    return await getProducts(filters);
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
    filters: {
      category: null,
      brand: null,
      color: null,
      priceMin: null,
      priceMax: null,
      search: "",
      sortBy: "newest",
    },
  },
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: null,
        brand: null,
        color: null,
        priceMin: null,
        priceMax: null,
        search: "",
        sortBy: "newest",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export const { setFilter, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;
