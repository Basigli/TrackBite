<template>
  <div class="recipe-list mt-4 max-w-2xl mx-auto">
    <div v-if="recipes.length === 0" class="text-gray-500 text-center py-4">
      No recipes found.
    </div>

    <ul>
      <li
        v-for="recipe in recipes"
        :key="recipe.id"
        class="bg-white border border-gray-200 rounded-xl p-4 mb-3 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow"
      >
        <div>
          <h3 class="font-bold text-gray-800 text-lg">{{ recipe.name }}</h3>
          <p class="text-sm text-gray-600 mt-1">
            Servings: <span class="font-medium">{{ recipe.servings }}</span> |
            Calories: <span class="font-medium">{{ recipe.totalCalories || 0 }}</span> kcal
          </p>
        </div>
        <div class="flex gap-3">
          <button
            @click="$emit('edit-recipe', recipe.id, { ...recipe })"
            class="text-blue-500 hover:text-blue-700 font-medium transition-colors"
          >
            Edit
          </button>
          <button
            @click="$emit('delete-recipe', recipe.id)"
            class="text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'RecipeList',
  props: { recipes: Array },
  emits: ['delete-recipe', 'edit-recipe'],
};
</script>
