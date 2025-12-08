<template>
  <div class="add-recipe mb-6 p-6 rounded-xl bg-white shadow-md max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Create New Recipe</h2>
    
    <div class="space-y-6">
      <!-- Basic Recipe Info -->
      <div class="grid grid-cols-1 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Recipe Name *
          </label>
          <input
            v-model="name"
            type="text"
            placeholder="e.g., Chicken Salad"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            v-model="description"
            placeholder="Brief description of your recipe..."
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition resize-none h-20"
          ></textarea>
        </div>
      </div>

      <!-- Ingredients Section -->
      <div class="border-t pt-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-800">Ingredients</h3>
          <button
            type="button"
            @click="showAddIngredient = !showAddIngredient"
            class="bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg px-4 py-2 transition shadow-sm flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Ingredient
          </button>
        </div>

        <!-- Add Ingredient Section -->
        <div v-if="showAddIngredient" class="bg-gray-50 rounded-lg p-4 mb-4 space-y-4">
          <!-- Scanned Items List -->
          <ScannedItemList @add="handleScannedItemSelected" />

          <!-- Selected Item Preview (before adding) -->
          <div v-if="selectedFoodItem" class="bg-white border-2 border-green-300 rounded-lg p-4">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h4 class="font-bold text-gray-800">{{ selectedFoodItem.name }}</h4>
                <p class="text-sm text-gray-600">
                  {{ selectedFoodItem.calories?.toFixed(0) || 0 }} kcal per {{ selectedFoodItem.quantity }}
                </p>
              </div>
              <button
                type="button"
                @click="selectedFoodItem = null"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Quantity for Recipe (grams) *
                </label>
                <input
                  v-model.number="ingredientQuantity"
                  type="number"
                  min="1"
                  placeholder="e.g., 150"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <button
                type="button"
                @click="addIngredientToRecipe"
                :disabled="!ingredientQuantity || ingredientQuantity <= 0"
                class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg px-4 py-2 transition shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add to Recipe
              </button>
            </div>
          </div>
        </div>

        <!-- Ingredients List -->
        <div v-if="ingredients.length > 0" class="space-y-2">
          <div
            v-for="(ingredient, index) in ingredients"
            :key="index"
            class="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow"
          >
            <div class="flex-1">
              <div class="flex items-center gap-3">
                <span class="font-semibold text-gray-800">{{ ingredient.name }}</span>
                <span class="text-sm text-gray-600">{{ ingredient.quantity }}</span>
                <span class="text-xs px-2 py-1 rounded-full" :class="getGradeColor(ingredient.grade)">
                  {{ ingredient.grade.toUpperCase() }}
                </span>
              </div>
              <div class="text-sm text-gray-500 mt-1">
                {{ ingredient.calories?.toFixed(0) || 0 }} kcal
              </div>
            </div>
            <button
              type="button"
              @click="removeIngredient(index)"
              class="text-red-500 hover:text-red-700 transition-colors p-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div v-else class="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <p class="text-gray-500">No ingredients added yet</p>
          <p class="text-gray-400 text-sm mt-1">Click "Add Ingredient" to get started</p>
        </div>
      </div>

      <!-- Recipe Summary -->
      <div v-if="ingredients.length > 0" class="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
        <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <span class="text-sm">{{ error }}</span>
      </div>

      <!-- Submit Buttons -->
      <div class="flex gap-3 pt-4 border-t">
        <button
          type="button"
          @click="resetForm"
          class="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Reset
        </button>
        <button
          type="button"
          @click="submitRecipe"
          :disabled="!isValid"
          class="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg px-4 py-3 transition shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Create Recipe
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRecipeStore } from '../store/recipeStore';
import { useUserStore } from '../store/userStore';
import ScannedItemList from './ScannedItemList.vue';

export default {
  name: 'AddRecipe',
  components: { ScannedItemList },
  emits: ['recipe-added'],
  setup(_, { emit }) {
    const store = useRecipeStore();
    const userStore = useUserStore();

    const name = ref('');
    const description = ref('');
    const ingredients = ref([]);
    const showAddIngredient = ref(false);
    const selectedFoodItem = ref(null);
    const ingredientQuantity = ref(100);
    const error = ref('');

    const totalCalories = computed(() => ingredients.value.reduce((sum, ing) => sum + (ing.calories || 0), 0));

    const recipeGrade = computed(() => {
      if (!ingredients.value.length) return 'c';
      const gradeValues = { a: 5, b: 4, c: 3, d: 2, e: 1 };
      const reverseGrades = { 5: 'a', 4: 'b', 3: 'c', 2: 'd', 1: 'e' };
      const avgValue = ingredients.value.reduce((sum, ing) => sum + (gradeValues[ing.grade?.toLowerCase()] || 3), 0) / ingredients.value.length;
      return reverseGrades[Math.round(avgValue)] || 'c';
    });

    const recipeMacros = computed(() => {
      if (!ingredients.value.length) return [];
      const macroMap = new Map();
      const totalWeight = ingredients.value.reduce((sum, ing) => sum + parseFloat(ing.quantity), 0);

      ingredients.value.forEach(ingredient => {
        const weight = parseFloat(ingredient.quantity);
        ingredient.nutrients?.forEach(nutrient => {
          if (!macroMap.has(nutrient.name)) {
            macroMap.set(nutrient.name, {
              _id: nutrient._id,
              name: nutrient.name,
              unit: nutrient.unit,
              totalAmount: 0,
              amount100g: 0,
              amountPerServing: 0
            });
          }
          const macro = macroMap.get(nutrient.name);
          macro.totalAmount += (nutrient.amount100g || 0) * weight / 100;
        });
      });

      const macros = Array.from(macroMap.values()).map(macro => ({
        ...macro,
        amount100g: (macro.totalAmount / totalWeight) * 100,
        amountPerServing: 0
      }));

      const mainMacros = ['protein', 'carbohydrates', 'fat', 'energy'];
      return macros.filter(m => mainMacros.includes(m.name.toLowerCase()));
    });

    const isValid = computed(() => name.value.trim() && ingredients.value.length > 0);

    const handleScannedItemSelected = food => {
      selectedFoodItem.value = food;
      ingredientQuantity.value = parseFloat(food.quantity) || 100;
    };

    const scaleNutrients = (nutrients, originalQuantity, newQuantity) => {
      if (!nutrients || !Array.isArray(nutrients)) return [];
      const scale = newQuantity / originalQuantity;
      return nutrients.map(nutrient => ({
        name: nutrient.name,
        unit: nutrient.unit,
        totalAmount: (nutrient.totalAmount || 0) * scale,
        amount100g: nutrient.amount100g || 0,
        amountPerServing: (nutrient.amountPerServing || 0) * scale
      }));
    };

    const addIngredientToRecipe = () => {
      if (!selectedFoodItem.value || !ingredientQuantity.value || ingredientQuantity.value <= 0) {
        error.value = 'Please select a food item and enter a valid quantity';
        return;
      }

      const originalQuantity = parseFloat(selectedFoodItem.value.quantity) || 100;
      const scale = ingredientQuantity.value / originalQuantity;

      const foodItem = {
        _id: selectedFoodItem.value._id,
        name: selectedFoodItem.value.name,
        quantity: `${ingredientQuantity.value}g`,
        calories: (selectedFoodItem.value.calories || 0) * scale,
        allergens: selectedFoodItem.value.allergens || [],
        ingredients: selectedFoodItem.value.ingredients || [],
        nutrients: scaleNutrients(selectedFoodItem.value.nutrients || [], originalQuantity, ingredientQuantity.value),
        macros: scaleNutrients(selectedFoodItem.value.macros || [], originalQuantity, ingredientQuantity.value),
        score: selectedFoodItem.value.score || 50,
        grade: selectedFoodItem.value.grade || 'c',
        nutrientLevels: selectedFoodItem.value.nutrientLevels || new Map()
      };

      ingredients.value.push(foodItem);
      selectedFoodItem.value = null;
      ingredientQuantity.value = 100;
      error.value = '';
      showAddIngredient.value = false;
    };

    const removeIngredient = index => ingredients.value.splice(index, 1);

    const resetForm = () => {
      name.value = '';
      description.value = '';
      ingredients.value = [];
      selectedFoodItem.value = null;
      ingredientQuantity.value = 100;
      showAddIngredient.value = false;
      error.value = '';
    };

    const submitRecipe = async () => {
      if (!isValid.value) {
        error.value = 'Please fill in all required fields and add at least one ingredient';
        return;
      }

      if (!userStore.user || !userStore.user._id) {
        error.value = 'User not logged in. Please log in to create a recipe.';
        return;
      }

      try {
        const recipe = {
          name: name.value.trim(),
          description: description.value.trim(),
          ingredients: ingredients.value,
          userId: userStore.user._id,
          grade: recipeGrade.value,
          macros: recipeMacros.value,
          createdAt: new Date()
        };



        await store.addRecipe(recipe);
        emit('recipe-added', recipe);
        resetForm();
      } catch (err) {
        console.error('Error creating recipe:', err);
        error.value = 'Failed to create recipe. Please try again.';
      }
    };

    const getGradeColor = grade => {
      const colors = { a: 'bg-green-100 text-green-800', b: 'bg-lime-100 text-lime-800', c: 'bg-yellow-100 text-yellow-800', d: 'bg-orange-100 text-orange-800', e: 'bg-red-100 text-red-800' };
      return colors[grade?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    const getGradeColorText = grade => {
      const colors = { a: 'text-green-600', b: 'text-lime-600', c: 'text-yellow-600', d: 'text-orange-600', e: 'text-red-600' };
      return colors[grade?.toLowerCase()] || 'text-gray-600';
    };

    return {
      name,
      description,
      ingredients,
      showAddIngredient,
      selectedFoodItem,
      ingredientQuantity,
      error,
      totalCalories,
      recipeGrade,
      recipeMacros,
      isValid,
      handleScannedItemSelected,
      addIngredientToRecipe,
      removeIngredient,
      resetForm,
      submitRecipe,
      getGradeColor,
      getGradeColorText
    };
  }
};
</script>
