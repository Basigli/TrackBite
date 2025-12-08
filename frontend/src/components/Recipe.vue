<template>
  <div class="recipe bg-white rounded-lg shadow-sm border-l-4 border-blue-400 p-4 mb-4">
    <!-- Recipe Name -->
    <h2 class="font-bold text-gray-800 text-xl mb-2">{{ recipe.name }}</h2>

    <!-- Recipe Description -->
    <p class="text-gray-700 mb-2">{{ recipe.description }}</p>

    <!-- Recipe Metadata -->
    <div class="text-gray-500 text-sm mb-4">
      <span>Created at: {{ formatDate(recipe.createdAt) }}</span> |
      <span>Grade: {{ recipe.grade }}</span>
    </div>

    <!-- Ingredients List -->
    <h3 class="font-semibold text-gray-800 mb-2">Ingredients</h3>
    <ul v-if="recipe.ingredients && recipe.ingredients.length > 0" class="ml-2 space-y-2 text-gray-600">
      <li v-for="foodItem in recipe.ingredients" :key="foodItem._id || foodItem.name" class="pb-1">
        <div>
          <strong>{{ foodItem.name }}</strong> — {{ foodItem.quantity }}
        </div>
        <div class="text-sm text-gray-500">
          <span v-if="foodItem.allergens?.length > 0"> Allergens: {{ foodItem.allergens.join(', ') }}</span>
        </div>
      </li>
    </ul>
    <p v-else class="text-gray-500 text-sm ml-2">No ingredients listed</p>

    <!-- Macros/Nutrients -->
    <div v-if="recipe.macros && recipe.macros.length > 0" class="mt-4">
      <h3 class="font-semibold text-gray-800 mb-2">Macros / Nutrients</h3>
      <ul class="ml-2 space-y-1 text-gray-600">
        <li v-for="nutrient in recipe.macros" :key="nutrient._id">
          {{ nutrient.name }}: {{ nutrient.amountPerServing }} {{ nutrient.unit }} per serving
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Recipe",
  props: {
    recipe: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return '-';
      const d = new Date(date);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
    },
  },
};
</script>
