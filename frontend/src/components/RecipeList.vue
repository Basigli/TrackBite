<template>
  <div class="recipe-list mt-4">
    <div v-if="recipes.length === 0" class="text-gray-500">No recipes found.</div>

    <ul>
      <li v-for="recipe in recipes" :key="recipe.id" class="border p-3 rounded mb-2 flex justify-between items-center">
        <div>
          <h3 class="font-semibold">{{ recipe.name }}</h3>
          <p class="text-sm text-gray-600">Servings: {{ recipe.servings }} | Calories: {{ recipe.totalCalories || 0 }} kcal</p>
        </div>
        <div class="flex gap-2">
          <button @click="$emit('edit-recipe', recipe.id, { ...recipe })" class="text-blue-500 hover:underline">Edit</button>
          <button @click="$emit('delete-recipe', recipe.id)" class="text-red-500 hover:underline">Delete</button>
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
