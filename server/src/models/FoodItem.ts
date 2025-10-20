import { ScannedItem } from "./ScannedItem";
import Document from 'mongoose';

export interface FoodItem extends Document {
  scannedItem: ScannedItem, 
  percentage: number
}