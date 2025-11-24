<template>
  <div class="recipe bg-white rounded-lg shadow-sm border-l-4 border-blue-400 p-4 mb-4">
    <h4 class="font-bold text-gray-800 text-md mb-2">
      {{ recipe.name }} ({{ recipe.servings }} servings)
    </h4>
    <ul class="ml-2 space-y-1 text-gray-600">
      <li v-for="ingredient in recipe.ingredients" :key="ingredient.id">
        {{ ingredient.name }} - {{ ingredient.quantity }}g
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Recipe',
  props: { recipe: Object },
};
</script>
