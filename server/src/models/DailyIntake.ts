import { FoodItem } from "./FoodItem";
import { Nutrient } from "./Nutrient";

export interface DailyIntake {
  totalCalories: number, 
  totalMacros: Array<Nutrient>,
  foodItems: Array<FoodItem>
  date: Date
}
