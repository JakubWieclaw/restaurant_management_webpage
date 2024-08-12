// cart slice
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
      action: PayloadAction<{ dishId: string; quantity: number }>
    ) {
      const existingItem = state.items.find(
        (item) => item.dish.id === action.payload.dishId
      );
      if (existingItem) {
        existingItem.quantity = action.payload.quantity;
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
