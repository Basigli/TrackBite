<template>
  <div class="bg-white shadow-sm sticky top-0 z-10">
    <div class="px-4 py-4">
      <h1 class="text-xl font-bold text-gray-900">Recipe Management</h1>
      <p class="text-sm text-gray-600 mt-0.5">{{ totalRecipes }} total recipes</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecipesPageHeader',
  props: {
    totalRecipes: {
      type: Number,
      required: true
    }
  }
};
</script>