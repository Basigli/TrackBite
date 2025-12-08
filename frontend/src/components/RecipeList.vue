<template>
  <div class="recipe-list mt-4 max-w-2xl mx-auto">
    <div v-if="recipes.length === 0" class="text-gray-500 text-center py-4">
      No recipes found.
    </div>

    <ul>
      <li
        v-for="recipe in editableRecipes"
        :key="recipe._id"
        class="mb-3"
      >
        <!-- VIEW MODE -->
        <div v-if="!recipe.isEditing">
          <Recipe :recipe="recipe" />

          <div class="flex justify-end gap-3 mt-2">
            <button
              @click="startEdit(recipe)"
              class="text-blue-500 hover:text-blue-700 font-medium text-sm"
            >
              Edit
            </button>

            <button
              @click="deleteRecipe(recipe._id)"
              class="text-red-500 hover:text-red-700 font-medium text-sm"
            >
              Delete
            </button>
          </div>
        </div>

        <!-- EDIT MODE -->
        <div v-else class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h3 class="font-bold text-gray-800 text-lg mb-4">{{ recipe.name }}</h3>

          <!-- Ingredients List -->
          <div class="mb-4">
            <h4 class="font-semibold text-gray-700 mb-2">Ingredients</h4>
            
            <ul class="space-y-2 mb-3">
              <li
                v-for="(ingredient, index) in recipe.edit.ingredients"
                :key="index"
                class="flex items-center gap-2 p-2 bg-gray-50 rounded"
              >
                <span class="flex-1 text-sm text-gray-700">
                  {{ ingredient.scannedItem.name }} — {{ ingredient.percentage }}%
                </span>
                <button
                  @click="removeIngredient(recipe, index)"
                  class="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </li>
            </ul>

            <!-- Add Ingredient: ONLY FROM SCANNED ITEMS -->
            <div class="border-t pt-3 mt-3">
              <p class="text-sm font-medium text-gray-700 mb-2">Add Ingredient</p>

              <ScannedItemList @add="handleScannedItem(recipe)" />

              <div v-if="selectedIngredient?.recipeId === recipe._id" class="mt-2 bg-gray-50 p-3 rounded">
                <p class="text-sm mb-1 font-medium">{{ selectedIngredient.item.name }}</p>

                <input
                  v-model.number="selectedIngredient.percentage"
                  type="number"
                  class="w-full border p-2 rounded mb-2"
                  placeholder="Percentage"
                  min="0"
                  max="100"
                />

                <button
                  @click="confirmAddIngredient()"
                  class="w-full bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
                  :disabled="!selectedIngredient.percentage || selectedIngredient.percentage <= 0"
                >
                  Add to Recipe
                </button>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t">
            <button
              @click="cancelEdit(recipe)"
              class="text-gray-500 hover:underline"
            >
              Cancel
            </button>

            <button
              @click="saveEdit(recipe)"
              class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRecipeStore } from '../store/recipeStore';
import Recipe from './Recipe.vue';
import ScannedItemList from './ScannedItemList.vue';

const store = useRecipeStore();
const recipes = computed(() => store.recipes);

const editableRecipes = computed(() =>
  recipes.value.map(r => ({
    ...r,
    isEditing: r.isEditing || false,
    edit: r.edit || { ...r, ingredients: r.ingredients ? [...r.ingredients] : [] },
  }))
);

const emit = defineEmits(['delete-recipe', 'save-recipe']);

// Track the currently selected scanned item before adding to recipe
const selectedIngredient = reactive({
  recipeId: null,
  item: null,
  percentage: null
});

const startEdit = (recipe) => {
  recipe.isEditing = true;
  selectedIngredient.recipeId = null;
  selectedIngredient.item = null;
  selectedIngredient.percentage = null;
};

const cancelEdit = (recipe) => {
  recipe.edit = { 
    ...recipe,
    ingredients: recipe.ingredients ? [...recipe.ingredients] : [],
  };
  recipe.isEditing = false;
  selectedIngredient.recipeId = null;
  selectedIngredient.item = null;
  selectedIngredient.percentage = null;
};

const handleScannedItem = (recipe) => (item) => {
  selectedIngredient.recipeId = recipe._id;
  selectedIngredient.item = item;
  selectedIngredient.percentage = null;
};

const confirmAddIngredient = () => {
  if (!selectedIngredient.item || !selectedIngredient.percentage) return;

  const recipe = editableRecipes.value.find(r => r._id === selectedIngredient.recipeId);
  if (!recipe) return;

  const ingredient = {
    _id: Date.now().toString(),
    percentage: selectedIngredient.percentage,
    scannedItem: selectedIngredient.item
  };

  recipe.edit.ingredients.push(ingredient);

  // Reset selection
  selectedIngredient.recipeId = null;
  selectedIngredient.item = null;
  selectedIngredient.percentage = null;
};

const removeIngredient = (recipe, index) => {
  recipe.edit.ingredients.splice(index, 1);
};

const saveEdit = (recipe) => {
  emit('save-recipe', recipe._id, { ...recipe.edit });
  recipe.isEditing = false;
};

const deleteRecipe = (recipeId) => {
  emit('delete-recipe', recipeId);
};
</script>
