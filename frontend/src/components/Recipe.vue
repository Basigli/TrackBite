<template>
  <div class="recipe bg-white rounded-lg shadow-sm border-l-4 border-blue-400 p-4 mb-4">
    <!-- Recipe Name -->
    <h4 class="font-bold text-gray-800 text-md mb-3">
      {{ recipe.name }}
    </h4>

    <!-- Ingredients List -->
    <ul class="ml-2 space-y-1 text-gray-600">
      <li
        v-for="foodItem in recipe.ingredients"
        :key="foodItem._id"
      >
        <!-- Display scanned item name and percentage -->
        {{ foodItem.scannedItem.name }} — {{ foodItem.percentage }}%
        
        <!-- Optional: display allergens -->
        <span v-if="foodItem.scannedItem.allergens.length > 0" class="text-red-500 ml-1">
          (Allergens: {{ foodItem.scannedItem.allergens.join(', ') }})
        </span>
      </li>
    </ul>
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
};
</script>
