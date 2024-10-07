import { Dish } from "../types/dish";

export interface CartItem {
  dish: Dish;
  quantity: number;
  removedIngredients: Set<string>;
}

export interface CartState {
  items: CartItem[];
  deliveryType: string;
  address: string;
}
