<template>
  <div class="grid grid-cols-2 gap-3 mb-4">
    <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white shadow-lg">
      <div class="text-3xl font-bold">{{ totalRecipes }}</div>
      <div class="text-sm opacity-90 mt-1">Total Recipes</div>
    </div>
    <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-lg">
      <div class="text-3xl font-bold">{{ uniqueUsers }}</div>
      <div class="text-sm opacity-90 mt-1">Users</div>
    </div>
    <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg">
      <div class="text-3xl font-bold">{{ avgPerUser }}</div>
      <div class="text-sm opacity-90 mt-1">Avg/User</div>
    </div>
    <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 text-white shadow-lg">
      <div class="text-3xl font-bold">{{ thisMonth }}</div>
      <div class="text-sm opacity-90 mt-1">This Month</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecipesStatsCards',
  props: {
    totalRecipes: { type: Number, required: true },
    uniqueUsers: { type: Number, required: true },
    avgPerUser: { type: String, required: true },
    thisMonth: { type: Number, required: true }
  }
};
</script>