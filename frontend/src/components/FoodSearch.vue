<template>
  <div class="food-search mb-4 max-w-md mx-auto">
    <input
      type="text"
      v-model="query"
      @input="searchFood"
      placeholder="Search for food..."
      class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-300 shadow-sm"
    />

    <ul
      v-if="results.length"
      class="border border-gray-200 rounded-lg mt-2 max-h-48 overflow-y-auto shadow-lg bg-white"
    >
      <li
        v-for="food in results"
        :key="food.id"
        @click="selectFood(food)"
        class="px-4 py-2 hover:bg-green-100 cursor-pointer transition-colors"
      >
        <div class="flex justify-between">
          <span class="font-medium">{{ food.name }}</span>
          <span class="font-semibold text-gray-700">{{ food.calories }} kcal</span>
        </div>
        <div v-if="food.source" class="text-xs text-gray-500 mt-1">
          {{ food.source }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useScannedItemStore } from '@/store/scannedItemStore';
import { useUserStore } from '@/store/userStore';

export default {
  name: 'FoodSearch',
  emits: ['select-food'],
  setup(_, { emit }) {
    const query = ref('');
    const results = ref([]);
    const scannedItemStore = useScannedItemStore();
    const userStore = useUserStore();

    // Get user's scanned items from the store
    const userScannedItems = computed(() => {
      return Array.from(scannedItemStore.scannedItems.values());
    });

    const searchFood = async () => {
      if (!query.value) {
        results.value = [];
        return;
      }

      const searchQuery = query.value.toLowerCase();
      const combinedResults = [];

      // Search in user's scanned items
      const scannedMatches = userScannedItems.value
        .filter(item => 
          item.name.toLowerCase().includes(searchQuery) ||
          (item.brand && item.brand.toLowerCase().includes(searchQuery)) ||
          (item.barcode && item.barcode.includes(searchQuery))
        )
        .map(item => ({
          id: item._id,
          name: item.name,
          calories: item.calories || 0,
          source: 'Scanned Item',
          originalItem: item
        }));

      combinedResults.push(...scannedMatches);

      // Search in recipes/ingredients API
      try {
        const res = await axios.get(`/recipes/search/ingredient/${query.value}`);
        const recipeMatches = res.data.map(r => ({
          id: r.id,
          name: r.name,
          calories: r.totalCalories || 0,
          source: 'Recipe Database',
          originalItem: r
        }));
        combinedResults.push(...recipeMatches);
      } catch (err) {
        console.error('Error searching food:', err);
      }

      results.value = combinedResults;
    };

    const selectFood = (food) => {
      // If it's a scanned item, emit the full item data
      if (food.source === 'Scanned Item' && food.originalItem) {
        emit('select-food', {
          ...food.originalItem,
          quantity: 100 // default quantity
        });
      } else {
        // For recipe database items, emit the basic food data
        emit('select-food', {
          id: food.id,
          name: food.name,
          calories: food.calories,
          quantity: 100
        });
      }
      
      query.value = '';
      results.value = [];
    };

    return { query, results, searchFood, selectFood };
  }
};
</script>