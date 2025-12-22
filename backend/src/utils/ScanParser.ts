import { Nutrient } from '../models/Nutrient';
import { ScannedItem } from '../models/ScannedItem';
import { ScannedItemImpl } from '../models/ScannedItemImpl';

export class ScanParser {
  
  static parse(scanData: string, barcode: string = '-1'): ScannedItem {
    let parsedData: any;
    try {
      parsedData = JSON.parse(scanData);
    } catch (error) {
      throw new Error('Invalid scan data format');
    }
    
    const name = parsedData.product.product_name || parsedData.product.generic_name || 'unknown';
    const quantity = parsedData.product.product_quantity || 0;
    const quantityPerServing = parsedData.product.serving_quantity || quantity;
    const quantityUnit = parsedData.product.product_quantity_unit || 'g';
    const score = parsedData.product.nutriscore_score || -1;
    const grade = parsedData.product.nutriscore_grade || 'unknown';
    const nutrientLevels = new Map<string, string>(Object.entries(parsedData.product.nutrient_levels || {}));
    const ingredients = parsedData.product.ingredients_without_ecobalyse_ids?.map((ingredient: string) => ingredient.split(':')[1]) || [];
    const allergens = ScanParser.parseAllergenNames(parsedData.product.allergens || '');
    const nutrients = ScanParser.parseNutrients(parsedData.product.nutriments || {});
    return new ScannedItemImpl( barcode, name, quantity, quantityPerServing, quantityUnit, allergens, nutrients, ingredients, score, grade, nutrientLevels);
  }

  static parseNutrients(nutrientData: any): Array<Nutrient> {
    const nutrients: Array<Nutrient> = [];
    const seenNutrients = new Set<string>();

    for (const [key, value] of Object.entries(nutrientData)) {
      const name = key.split('_')[0];
      
      // Skip if we've already seen this nutrient or if it's not a base nutrient name
      if (seenNutrients.has(name) || key.includes('_')) {
        continue;
      }
      
      const totalAmount = nutrientData[name + "_value"] || nutrientData[name];
      const unit = nutrientData[name + "_unit"] || 'g';
      const amount100g = nutrientData[name + "_100g"] || totalAmount;
      const amountPerServing = nutrientData[name + "_serving"] || amount100g;
      
      // Only add if we have valid data
      if (totalAmount !== undefined && unit && amount100g !== undefined) {
        // Don't include _id in the nutrient object - let Mongoose handle it
        nutrients.push({
          name: name,
          unit: unit,
          totalAmount: totalAmount,
          amount100g: amount100g,
          amountPerServing: amountPerServing
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
