import { FoodItem } from "./FoodItem";
import Document from 'mongoose';

export interface DailyIntake extends Document{
  totalCalories: number, 
  totalMacros: Map<string, number>
  foodItems: Array<FoodItem>
  date: Date
}
