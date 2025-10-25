import { Nutrient } from "./Nutrient";

export class NutrientImpl implements Nutrient {
  constructor(
    public _id: number,
    public name: string,
    public totalAmount: number,
    public unit: string,
    public amount100g: number,
  ) {}
}
