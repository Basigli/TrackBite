<template>
  <div class="food-search mb-4">
    <input
      type="text"
      v-model="query"
      @input="searchFood"
      placeholder="Search for food..."
      class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-300 shadow-sm"
    />

    <!-- Results Container -->
    <div v-if="results.length" class="mt-4 space-y-3">
      <!-- Scanned Items Section -->
      <div v-if="scannedResults.length > 0">
        <h4 class="text-sm font-semibold text-gray-700 mb-2 px-1">Your Scanned Items</h4>
        <div class="space-y-2">
          <ScannedItem
            v-for="food in scannedResults"
            :key="food.id"
            :item="food.originalItem"
            @add="handleScannedItemAdd"
          />
        </div>
      </div>

      <!-- Recipe Database Section -->
      <div v-if="recipeResults.length > 0">
        <h4 class="text-sm font-semibold text-gray-700 mb-2 px-1">Recipe Database</h4>
        <ul class="border border-gray-200 rounded-lg shadow-sm bg-white divide-y divide-gray-200">
          <li
            v-for="food in recipeResults"
            :key="food.id"
            @click="selectRecipeFood(food)"
            class="px-4 py-3 hover:bg-green-50 cursor-pointer transition-colors"
          >
            <div class="flex justify-between items-center">
              <div class="flex-1">
                <span class="font-medium text-gray-800 block">{{ food.name }}</span>
                <span class="text-xs text-gray-500">{{ food.source }}</span>
              </div>
              <div class="text-right">
                <span class="font-semibold text-green-600">{{ food.calories }}</span>
                <span class="text-sm text-gray-600 ml-1">kcal</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- No Results Message -->
    <div v-else-if="query && !results.length" class="mt-4 text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <p class="text-gray-500 text-sm">No results found for "{{ query }}"</p>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useScannedItemStore } from '@/store/scannedItemStore';
import { useUserStore } from '@/store/userStore';
import ScannedItem from './ScannedItem.vue';

export default {
  name: 'FoodSearch',
  components: { ScannedItem },
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

    // Separate scanned items from recipe database results
    const scannedResults = computed(() => {
      return results.value.filter(r => r.source === 'Scanned Item');
    });

    const recipeResults = computed(() => {
      return results.value.filter(r => r.source === 'Recipe Database');
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

    const handleScannedItemAdd = (foodItem) => {
      // Emit the converted food item from ScannedItem component
      emit('select-food', foodItem);
      query.value = '';
      results.value = [];
    };

    const selectRecipeFood = (food) => {
      // For recipe database items, emit the basic food data
      emit('select-food', {
        id: food.id,
        name: food.name,
        calories: food.calories,
        quantity: 100,
        grade: 'c',
        nutrients: []
      });
      
      query.value = '';
      results.value = [];
    };

    return { 
      query, 
      results, 
      scannedResults,
      recipeResults,
      searchFood, 
      handleScannedItemAdd,
      selectRecipeFood
    };
  }
};
</script>