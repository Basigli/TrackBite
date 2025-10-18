import { Nutrient } from "./Nutrient";

export class NutrientImpl implements Nutrient {
  constructor(
    public id: number,
    public name: string,
    public totalAmount: number,
    public unit: string,
    public amount100g: number,
    public isAllergen: boolean
  ) {}
}
