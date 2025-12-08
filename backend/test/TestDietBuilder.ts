import { DietBuilder} from "../src/utils/DietBuilder";
import { Diet } from "../src/models/Diet";
import { Nutrient } from "../src/models/Nutrient";

function testDietBuilder() {
    const macrosPercentage = new Map<string, number>([
        ["Protein", 30],
        ["Fat", 25],
        ["Carbohydrates", 45]
    ]);

    const dietBuilder = new DietBuilder("Test Diet", 2000, macrosPercentage, "test-user-id");
    const diet: Diet = dietBuilder.build();

    console.log("Diet Name:", diet.name);
    console.log("Calories Amount:", diet.caloriesAmount);
    console.log("User ID:", diet.userId);
    console.log("Macros:");
    diet.macros.forEach((macro: Nutrient) => {
        console.log(`  - ${macro.name}: ${macro.totalAmount} ${macro.unit}`);
    });
}

testDietBuilder();