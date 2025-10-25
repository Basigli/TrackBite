import { Nutrient } from "./Nutrient";

export interface ScannedItem {
  _id: string, 
  name: string, 
  allergens: Array<string>,
  nutrients: Array<Nutrient>,
  ingredients: string[],
  score: number,
  grade: string,
  nutrientLevels: Map<string, string>
}
