import { Nutrient } from "./Nutrient";
import Document from 'mongoose';

export interface ScannedItem extends Document {
  id: number, 
  name: string, 
  allergens: Array<string>,
  nutrients: Array<Nutrient>,
  ingredients: string[],
  score: number,
  grade: string,
  nutrientLevels: Map<string, string>
}
