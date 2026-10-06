import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/types";

type WishlistState = {
  items: Product[];
};

const initialState: WishlistState = {
  items: []
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const exists = state.items.some((item) => item.id === action.payload.id);
      state.items = exists
        ? state.items.filter((item) => item.id !== action.payload.id)
        : [...state.items, action.payload];
    },
    setWishlistItems: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    }
  }
});

export const { toggleWishlist, setWishlistItems } = wishlistSlice.actions;
export default wishlistSlice.reducer;
