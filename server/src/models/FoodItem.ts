import { ScannedItem } from "./ScannedItem";

export interface FoodItem {
  _id: string, 
  scannedItem: ScannedItem, 
  percentage: number
}