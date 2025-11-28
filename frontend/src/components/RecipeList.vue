<template>
  <div class="recipe-list mt-4 max-w-2xl mx-auto">
    <div v-if="recipes.length === 0" class="text-gray-500 text-center py-4">
      No recipes found.
    </div>

    <ul>
      <li
        v-for="recipe in editableRecipes"
        :key="recipe.id"
        class="mb-3"
      >
        <!-- VIEW MODE -->
        <div v-if="!recipe.isEditing">
          <!-- Use Recipe component for display -->
          <Recipe :recipe="recipe" />
          
          <!-- Action buttons below the recipe card -->
          <div class="flex justify-end gap-3 mt-2">
            <button
              @click="startEdit(recipe)"
              class="text-blue-500 hover:text-blue-700 font-medium text-sm"
            >
              Edit
            </button>

            <button
              @click="emit('delete-recipe', recipe._id)"
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

            <!-- Add Ingredient Form -->
            <div class="border-t pt-3 mt-3">
              <p class="text-sm font-medium text-gray-700 mb-2">Add Ingredient</p>
              
              <input
                v-model="newIngredient.name"
                class="w-full border p-2 rounded mb-2"
                placeholder="Ingredient name"
              />

              <input
                v-model.number="newIngredient.percentage"
                type="number"
                class="w-full border p-2 rounded mb-2"
                placeholder="Percentage"
                min="0"
                max="100"
              />

              <input
                v-model="newIngredient.allergens"
                class="w-full border p-2 rounded mb-2"
                placeholder="Allergens (comma separated, optional)"
              />

              <button
                @click="addIngredient(recipe)"
                class="w-full bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
              >
                Add Ingredient
              </button>
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
import { ref, watch, reactive } from 'vue';
import Recipe from './Recipe.vue'; // Update path as needed

const props = defineProps({
  recipes: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['delete-recipe', 'save-recipe']);

const editableRecipes = ref([]);

const newIngredient = reactive({
  name: '',
  percentage: null,
  allergens: '',
});

// Watch for changes in recipes prop
watch(
  () => props.recipes,
  (list) => {
    editableRecipes.value = list.map((r) => ({
      ...r,
      isEditing: false,
      edit: { 
        ...r,
        ingredients: r.ingredients ? [...r.ingredients] : [],
      },
    }));
  },
  { immediate: true }
);

const startEdit = (recipe) => {
  recipe.isEditing = true;
  // Reset new ingredient form
  newIngredient.name = '';
  newIngredient.percentage = null;
  newIngredient.allergens = '';
};

const cancelEdit = (recipe) => {
  recipe.edit = { 
    ...recipe,
    ingredients: recipe.ingredients ? [...recipe.ingredients] : [],
  };
  recipe.isEditing = false;
};

const addIngredient = (recipe) => {
  if (!newIngredient.name || newIngredient.percentage === null) {
    alert('Please enter ingredient name and percentage');
    return;
  }

  const ingredient = {
    _id: Date.now().toString(), // Temporary ID
    percentage: newIngredient.percentage,
    scannedItem: {
      name: newIngredient.name,
      allergens: newIngredient.allergens 
        ? newIngredient.allergens.split(',').map(a => a.trim()).filter(Boolean)
        : [],
    },
  };

  recipe.edit.ingredients.push(ingredient);

  // Reset form
  newIngredient.name = '';
  newIngredient.percentage = null;
  newIngredient.allergens = '';
};

const removeIngredient = (recipe, index) => {
  recipe.edit.ingredients.splice(index, 1);
};

const saveEdit = (recipe) => {
  emit('save-recipe', recipe._id, { ...recipe.edit });
  recipe.isEditing = false;
};
</script>