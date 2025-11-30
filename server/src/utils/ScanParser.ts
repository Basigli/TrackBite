import { Nutrient } from '../models/Nutrient';
import { ScannedItem } from '../models/ScannedItem';
import { NutrientImpl } from '../models/NutrientImpl';  
import { ScannedItemImpl } from '../models/ScannedItemImpl';

export class ScanParser {
  
  static parse(scanData: string, id: string = '-1'): ScannedItem {
    let parsedData: any;
    try {
      parsedData = JSON.parse(scanData);
    } catch (error) {
      throw new Error('Invalid scan data format');
    }
    
    let name = parsedData.product.product_name || parsedData.product.generic_name || 'unknown';
    let score = parsedData.product.nutriscore_score || -1;
    let grade = parsedData.product.nutriscore_grade || 'unknown';
    let nutrientLevels = new Map<string, string>(Object.entries(parsedData.product.nutrient_levels || {}));
    let ingredients = parsedData.product.ingredients_without_ecobalyse_ids?.map((ingredient: string) => ingredient.split(':')[1]) || [];
    let allergens = ScanParser.parseAllergenNames(parsedData.product.allergens_from_ingredients || '');
    let nutrients = ScanParser.parseNutrients(parsedData.product.nutriments || {});
    
    return new ScannedItemImpl(id, name, allergens, nutrients, ingredients, score, grade, nutrientLevels);
  }

  static parseNutrients(nutrientData: any): Array<Nutrient> {
    let nutrients: Array<Nutrient> = [];
    let seenNutrients = new Set<string>();

    for (let [key, value] of Object.entries(nutrientData)) {
      const name = key.split('_')[0];
      
      // Skip if we've already seen this nutrient or if it's not a base nutrient name
      if (seenNutrients.has(name) || key.includes('_')) {
        continue;
      }
      
      const totalAmount = nutrientData[name + "_value"] || nutrientData[name];
      const unit = nutrientData[name + "_unit"] || 'g';
      const amount100g = nutrientData[name + "_100g"] || totalAmount;
      
      // Only add if we have valid data
      if (totalAmount !== undefined && unit && amount100g !== undefined) {
        // Don't include _id in the nutrient object - let Mongoose handle it
        nutrients.push({
          name: name,
          unit: unit,
          totalAmount: totalAmount,
          amount100g: amount100g
        } as Nutrient);
        seenNutrients.add(name);
      }
    }
    
    return nutrients;
  }

  static parseAllergenNames(rawAllergens: string): Array<string> {
    if (!rawAllergens) return [];
    return rawAllergens.split(', ').map(allergen => {
      const parts = allergen.split(':');
      return parts.length > 1 ? parts[1] : allergen;
    });
  }
}
