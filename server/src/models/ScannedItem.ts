import { Nutrient } from "./Nutrient";

export interface ScannedItem {
  id: number, 
  name: string, 
  allergens: Array<string>,
  nutrients: Array<Nutrient>,
  ingredients: string[],
  score: number,
  grade: string,
  nutrientLevels: Map<string, string>
}
