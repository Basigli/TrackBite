import { ScannedItem } from "./ScannedItem";

export interface FoodItem {
  _id: number, 
  scannedItem: ScannedItem, 
  percentage: number
}