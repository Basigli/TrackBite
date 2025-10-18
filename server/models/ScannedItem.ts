import { Nutrient } from "./Nutrient";

export interface ScannedItem {
  id: number, 
  nome: string, 
  allergenes: Array<Nutrient>,
  nutrients: Array<Nutrient>,
  ingredients: string[],
  score: number,
  grade: string,
  nutrientLevels: Map<string, string>
}
