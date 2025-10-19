import { Nutrient } from '../models/Nutrient';
import { ScannedItem } from '../models/ScannedItem';
import { NutrientImpl } from '../models/NutrientImpl';  
import { ScannedItemImpl } from '../models/ScannedItemImpl';
export class ScanParser {
  constructor () {

  }

  parse(scanData: string): ScannedItem {
    let parsedData: any;
    try {
      parsedData = JSON.parse(scanData);
    } catch (error) {
      throw new Error('Invalid scan data format');
    }
    let id = parsedData.product._id || -1;
    let name = parsedData.product.generic_name || 'unknown';
    let score = parsedData.product.nutriscore_score || -1;
    let grade = parsedData.product.nutriscore_grade || 'unknown';
    let nutrientLevels = new Map<string, string>(Object.entries(parsedData.product.nutrient_levels || {}));
    let ingredients = parsedData.product.ingredients_without_ecobalyse_ids.map((ingredient: string) => ingredient.split(':')[1])  || [];
    // let allergeneNames = parsedData.product.allergens || [];
    let allergens = this.parseAllergenNames(parsedData.product.allergens_from_ingredients);
    // let allergeneNames = parsedData.product.allergens.map((allergen: string) => allergen.split(':')[1]) || [];
    let nutrients = this.parseNutrients(parsedData.product.nutriments || {});
    //let allergenes = nutrients.filter(nutrient => nutrient.isAllergen);
    return new ScannedItemImpl(id, name, allergens, nutrients, ingredients, score, grade, nutrientLevels);
  }



  parseNutrients(nutrientData: any): Array<Nutrient> {
    let nutrients: Array<Nutrient> = [];
    let seenNutrients = new Set<string>();
    //let allergenes = nutrientData.allergens.map((allergen: string) => allergen.split(':')[1]) || [];
    
    for (let [key, value] of Object.entries(nutrientData)) {
      const name = key.split('_')[0];
      if (seenNutrients.has(name)) {
        continue; // Skip duplicate nutrient
      }
      const totalAmount =  nutrientData[name + "_value"];
      const unit = nutrientData[name + "_unit"];
      const amount100g = nutrientData[name + "_100g"];
      const id = -1; // Placeholder, replace with actual ID logic
      nutrients.push(new NutrientImpl(id, name, totalAmount, unit, amount100g));
      seenNutrients.add(name);
    }
    return nutrients;
  }

  parseAllergenNames(rawAllergens: string): Array<string> {
    //let allergens: Array<string> = [];
    return rawAllergens.split(', ').map(allergen => allergen.split(':')[1]);
    //return allergens;
  }

}
