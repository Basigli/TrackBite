import { FoodItem } from "./FoodItem.ts";

export interface DailyIntake {
  totalCalories: number, 
  totalMacros: Map<string, number>
  foodItems: Array<FoodItem>
}
