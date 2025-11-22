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
        class="px-4 py-2 hover:bg-green-100 cursor-pointer transition-colors flex justify-between"
      >
        <span>{{ food.name }}</span>
        <span class="font-semibold text-gray-700">{{ food.calories }} kcal</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import axios from 'axios';

export default {
  name: 'FoodSearch',
  emits: ['select-food'],
  setup(_, { emit }) {
    const query = ref('');
    const results = ref([]);

    const searchFood = async () => {
      if (!query.value) {
        results.value = [];
        return;
      }
      try {
        const res = await axios.get(`/recipes/search/ingredient/${query.value}`);
        results.value = res.data.map(r => ({
          id: r.id,
          name: r.name,
          calories: r.totalCalories || 0,
        }));
      } catch (err) {
        console.error('Error searching food:', err);
      }
    };

    const selectFood = (food) => {
      emit('select-food', food);
      query.value = '';
      results.value = [];
    };

    return { query, results, searchFood, selectFood };
  }
};
</script>
