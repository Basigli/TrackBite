import { ScannedItem } from "./ScannedItem";
import { Nutrient } from "./Nutrient";

export class ScannedItemImpl implements ScannedItem {
  constructor(
    public id: number,
    public name: string,
    public allergens: Array<string>,
    public nutrients: Array<Nutrient>,
    public ingredients: Array<string>,
    public score: number,
    public grade: string,
    public nutrientLevels: Map<string, string>
  ) {}
}
