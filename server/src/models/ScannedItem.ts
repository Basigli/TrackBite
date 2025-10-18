import { Nutrient } from "./Nutrient";

export interface ScannedItem {
  id: number, 
  name: string, 
  allergens: Array<Nutrient>,
  nutrients: Array<Nutrient>,
  ingredients: string[],
  score: number,
  grade: string,
  nutrientLevels: Map<string, string>
}
