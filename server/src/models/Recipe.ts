import { FoodItem } from "./FoodItem";

export interface Recipe {
  _id: number, 
  name: string,
  ingredients: Array<FoodItem>
}
