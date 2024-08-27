import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartState, CartItem } from "../../types/cartTypes";

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existingItem = state.items.find(
        (item) =>
          item.dish.id === action.payload.dish.id &&
          JSON.stringify(item.removedIngredients) ===
            JSON.stringify(action.payload.removedIngredients)
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart(state, action: PayloadAction<{ row: any }>) {
      state.items = state.items.filter((item) => {
        return JSON.stringify(action.payload.row.item) !== JSON.stringify(item);
      });
    },
    updateCartItem(
      state,
      action: PayloadAction<{
        row: any;
        quantity: number;
        removedIngredients: string[];
      }>
    ) {
      const existingItem = state.items.find(
        (item) =>
          JSON.stringify(item) === JSON.stringify(action.payload.row.item)
      );
      if (existingItem) {
        const idx = state.items.indexOf(existingItem);
        state.items[idx].quantity = action.payload.quantity;
        state.items[idx].removedIngredients = action.payload.removedIngredients;
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateCartItem, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
