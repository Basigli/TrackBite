import type { ScannedItem } from "../models/ScannedItem";
import type { FoodItem } from "../models/FoodItem";
import type { Nutrient } from "../models/Nutrient";

export class FoodItemBuilder {
    private scannedItem: ScannedItem;
    private servings?: number;
    private grams?: number;
    private percentage: number = 100;

    constructor(scannedItem: ScannedItem) {
        this.scannedItem = scannedItem;
    }

    /**
     * Set the number of servings
     */
    withServings(servings: number): FoodItemBuilder {
        this.servings = servings;
        this.grams = undefined; // Clear grams if servings is set
        return this;
    }

    /**
     * Set the amount in grams
     */
    withGrams(grams: number): FoodItemBuilder {
        this.grams = grams;
        this.servings = undefined; // Clear servings if grams is set
        return this;
    }

    /**
     * Calculate the percentage based on servings or grams
     */
    private calculatePercentage(): number {
        if (this.servings !== undefined) {
            // Calculate based on servings
            const totalServings = this.scannedItem.quantity / this.scannedItem.quantityPerServing;
            return (this.servings / totalServings) * 100;
        } else if (this.grams !== undefined) {
            // Calculate based on grams
            return (this.grams / this.scannedItem.quantity) * 100;
        }
        return 100; // Default to 100%
    }

    /**
     * Scale nutrients based on the percentage
     */
    private scaleNutrients(nutrients: Array<Nutrient>, percentage: number): Map<string, string> {
        return new Map(
            nutrients.map(nutrient => [
                nutrient.name,
                `${(nutrient.totalAmount * (percentage / 100)).toFixed(2)} ${nutrient.unit}`
            ])
        );
    }

    /**
     * Build the FoodItem with calculated values
     */
    build(): FoodItem {
        this.percentage = this.calculatePercentage();

        const scaledNutrients = this.scaleNutrients(
            this.scannedItem.nutrients,
            this.percentage
        );
        const macroNames = ['protein', 'carbohydrates', 'fat'];
        return {
            name: this.scannedItem.name,
            quantity: `${(this.scannedItem.quantity * (this.percentage / 100)).toFixed(2)} g`,
            calories: parseFloat(scaledNutrients.get('energy') ?? '0'),
            allergens: this.scannedItem.allergens,
            ingredients: this.scannedItem.ingredients,
            nutrients: new Map(
            Array.from(scaledNutrients)
                .filter(([name]) => !macroNames.includes(name.toLowerCase()))
            ),
            macros: new Map(
            Array.from(scaledNutrients)
                .filter(([name]) => macroNames.includes(name.toLowerCase()))
            ),
            score: this.scannedItem.score,
            grade: this.scannedItem.grade,
            nutrientLevels: this.scannedItem.nutrientLevels
        };
    }
}

export class FoodItemConverter {
    /**
     * Create a FoodItemBuilder for the given scanned item
     */
    toFoodItem(scannedItem: ScannedItem): FoodItemBuilder {
        return new FoodItemBuilder(scannedItem);
    }

    /**
     * Convert a scanned item to a food item with default 100% percentage
     */
    toFoodItemDefault(scannedItem: ScannedItem): FoodItem {
        return new FoodItemBuilder(scannedItem).build();
    }

    /**
     * Convert a scanned item to a food item with specified servings
     */
    toFoodItemWithServings(scannedItem: ScannedItem, servings: number): FoodItem {
        return new FoodItemBuilder(scannedItem)
            .withServings(servings)
            .build();
    }

    /**
     * Convert a scanned item to a food item with specified grams
     */
    toFoodItemWithGrams(scannedItem: ScannedItem, grams: number): FoodItem {
        return new FoodItemBuilder(scannedItem)
            .withGrams(grams)
            .build();
    }
}
