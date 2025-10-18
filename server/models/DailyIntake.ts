import { FoodItem } from "./FoodItem.ts";
import { Nutrient } from "./Nutrient.ts";

export interface DailyIntake {
  totalCalories: number, 
  totalMacros: Array<Nutrient>
  foodItems: Array<FoodItem>
  date: Date
}
