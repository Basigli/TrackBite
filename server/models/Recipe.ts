import { FoodItem } from "./FoodItem";

export interface Recipe {
  id?: number, 
  name: string,
  ingredients: Array<FoodItem>
}
