import { FoodItem } from "./FoodItem";

export interface Recipe {
  _id: string, 
  name: string,
  ingredients: Array<FoodItem>
}
