import { FoodItem } from "./FoodItem";
import Document from 'mongoose';

export interface Recipe extends Document {
  id?: number, 
  name: string,
  ingredients: Array<FoodItem>
}
