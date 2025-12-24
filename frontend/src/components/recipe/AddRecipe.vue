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
          <div>
            <h4 class="text-sm font-semibold text-gray-700 mb-3">Search for Food</h4>
            <FoodSearch @select-food="handleFoodSelected" />
          </div>
          <div class="border-t pt-4">
            <h4 class="text-sm font-semibold text-gray-700 mb-3">Or Select from Scanned Items</h4>
            <ScannedItemList @add="handleScannedItemSelected" />
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
                <span class="text-sm text-gray-600">{{ ingredient.quantity }}g</span>
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
        <h4 class="font-semibold text-gray-800 mb-3">Recipe Summary</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg p-3 text-center">
            <div class="text-xs text-gray-600 mb-1">Total Calories</div>
            <div class="font-bold text-green-600 text-lg">{{ totalCalories.toFixed(0) }}</div>
          </div>
          <div class="bg-white rounded-lg p-3 text-center">
            <div class="text-xs text-gray-600 mb-1">Ingredients</div>
            <div class="font-bold text-blue-600 text-lg">{{ ingredients.length }}</div>
          </div>
          <div class="bg-white rounded-lg p-3 text-center">
            <div class="text-xs text-gray-600 mb-1">Grade</div>
            <div class="font-bold text-lg" :class="getGradeColorText(recipeGrade)">
              {{ recipeGrade.toUpperCase() }}
            </div>
          </div>
        </div>
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
import { useRecipeStore } from '../../store/recipeStore';
import { useUserStore } from '../../store/userStore';
import ScannedItemList from '../food/ScannedItemList.vue';
import FoodSearch from '../food/FoodSearch.vue';

export default {
  name: 'AddRecipe',
  components: { ScannedItemList, FoodSearch },
  emits: ['recipe-added'],
  setup(_, { emit }) {
    const store = useRecipeStore();
    const userStore = useUserStore();

    const name = ref('');
    const description = ref('');
    const ingredients = ref([]);
    const showAddIngredient = ref(false);
    const error = ref('');

    const totalCalories = computed(() => {
      return ingredients.value.reduce((sum, ing) => sum + (ing.calories || 0), 0);
    });

    // Calculate average grade
    const recipeGrade = computed(() => {
      if (!ingredients.value.length) return 'c';
      const gradeValues = { a: 5, b: 4, c: 3, d: 2, e: 1 };
      const reverseGrades = { 5: 'a', 4: 'b', 3: 'c', 2: 'd', 1: 'e' };
      const avgValue = ingredients.value.reduce((sum, ing) => {
        return sum + (gradeValues[ing.grade?.toLowerCase()] || 3);
      }, 0) / ingredients.value.length;
      return reverseGrades[Math.round(avgValue)] || 'c';
    });

    // Sum all nutrients from all ingredients
    const recipeNutrients = computed(() => {
      if (!ingredients.value.length) return [];
      
      const nutrientMap = new Map();

      ingredients.value.forEach(ingredient => {
        if (!ingredient.nutrients || !Array.isArray(ingredient.nutrients)) return;
        
        ingredient.nutrients.forEach(nutrient => {
          if (!nutrientMap.has(nutrient.name)) {
            nutrientMap.set(nutrient.name, {
              name: nutrient.name,
              unit: nutrient.unit,
              totalAmount: 0,
              amount100g: 0,
              amountPerServing: 0
            });
          }
          
          const nutrientData = nutrientMap.get(nutrient.name);
          nutrientData.totalAmount += (nutrient.totalAmount || 0);
        });
      });

      return Array.from(nutrientMap.values());
    });

    // Sum all macros from all ingredients
    const recipeMacros = computed(() => {
      if (!ingredients.value.length) return [];
      
      const macroMap = new Map();

      ingredients.value.forEach(ingredient => {
        if (!ingredient.macros || !Array.isArray(ingredient.macros)) return;
        
        ingredient.macros.forEach(macro => {
          if (!macroMap.has(macro.name)) {
            macroMap.set(macro.name, {
              name: macro.name,
              unit: macro.unit,
              totalAmount: 0,
              amount100g: 0,
              amountPerServing: 0
            });
          }
          
          const macroData = macroMap.get(macro.name);
          macroData.totalAmount += (macro.totalAmount || 0);
        });
      });

      return Array.from(macroMap.values());
    });

    const isValid = computed(() => {
      return name.value.trim() && ingredients.value.length > 0;
    });

    const handleScannedItemSelected = (foodItem) => {
      ingredients.value.push(foodItem);
      error.value = '';
      showAddIngredient.value = false;
    };

    const handleFoodSelected = (foodItem) => {
      // Ensure the food item has the required structure
      const ingredient = {
        name: foodItem.name,
        quantity: foodItem.quantity || 100,
        calories: foodItem.calories || 0,
        grade: foodItem.grade || 'c',
        nutrients: foodItem.nutrients || [],
        macros: foodItem.macros || [],
        ...foodItem // spread any additional properties
      };
      
      ingredients.value.push(ingredient);
      error.value = '';
      showAddIngredient.value = false;
    };

    const removeIngredient = (index) => {
      ingredients.value.splice(index, 1);
    };

    const resetForm = () => {
      name.value = '';
      description.value = '';
      ingredients.value = [];
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
          userName: userStore.user.nickname || 'Anonymous',
          grade: recipeGrade.value,
          macros: recipeMacros.value,
          nutrients: recipeNutrients.value,
          createdAt: new Date(),
          totalCalories: totalCalories.value, 
        };

        await store.addRecipe(recipe);
        emit('recipe-added', recipe);
        resetForm();
      } catch (err) {
        console.error('Error creating recipe:', err);
        error.value = 'Failed to create recipe. Please try again.';
      }
    };

    const getGradeColor = (grade) => {
      const colors = {
        a: 'bg-green-100 text-green-800',
        b: 'bg-lime-100 text-lime-800',
        c: 'bg-yellow-100 text-yellow-800',
        d: 'bg-orange-100 text-orange-800',
        e: 'bg-red-100 text-red-800'
      };
      return colors[grade?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    const getGradeColorText = (grade) => {
      const colors = {
        a: 'text-green-600',
        b: 'text-lime-600',
        c: 'text-yellow-600',
        d: 'text-orange-600',
        e: 'text-red-600'
      };
      return colors[grade?.toLowerCase()] || 'text-gray-600';
    };

    return {
      name,
      description,
      ingredients,
      showAddIngredient,
      error,
      totalCalories,
      recipeGrade,
      recipeMacros,
      recipeNutrients,
      isValid,
      handleScannedItemSelected,
      handleFoodSelected,
      removeIngredient,
      resetForm,
      submitRecipe,
      getGradeColor,
      getGradeColorText
    };
  }
};
</script>