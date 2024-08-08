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
          item.dish.ingredients === action.payload.dish.ingredients
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart(state, action: PayloadAction<{ dishId: string }>) {
      state.items = state.items.filter(
        (item) => item.dish.id !== action.payload.dishId
      );
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
