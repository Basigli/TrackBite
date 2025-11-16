<template>
  <div class="recipe border-l-4 border-blue-400 pl-2 mb-2">
    <h4 class="font-semibold">{{ recipe.name }} ({{ recipe.servings }} servings)</h4>
    <ul class="ml-2">
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
