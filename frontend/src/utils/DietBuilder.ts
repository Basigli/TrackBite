import type { Diet } from "../models/Diet";
import type { Nutrient } from "../models/Nutrient";

export class DietBuilder {
    private name: string;
    private caloriesAmount: number;
    private macrosPercentage: Map<string, number>;
    private macros: Array<Nutrient> = [];
    private userId: string;
    
    constructor(name: string, caloriesAmount: number, macrosPercentage: Map<string, number>, userId: string) {
        this.name = name;
        this.caloriesAmount = caloriesAmount;
        this.macrosPercentage = macrosPercentage;
        this.userId = userId;
    }

    private getCaloriesPerGram(macroName: string): number {
        switch (macroName.toLowerCase()) {
            case "protein":
            case "carbohydrates":
                return 4;
            case "fat":
                return 9;
            default:
                throw new Error(`Unknown macro name: ${macroName}`);
        }
    }


    private calculateMacroAmounts(): void { 
        this.macrosPercentage.forEach((percentage, macroName) => {
            const totalAmount = parseFloat((this.caloriesAmount * (percentage / 100) / this.getCaloriesPerGram(macroName)).toFixed(2));
            this.macros.push({
                name: macroName,
                unit: "g",
                totalAmount: totalAmount,
                amount100g: 0,
                amountPerServing: 0
            } as Nutrient);
        }); 
    }
    /**
     * Build and return the Diet object
     */
    build(): Diet {
        this.calculateMacroAmounts();
        return {name: this.name, caloriesAmount: this.caloriesAmount, macros: this.macros, userId: this.userId} as Diet;
    }
}