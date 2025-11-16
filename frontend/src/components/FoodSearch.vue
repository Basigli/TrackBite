<template>
  <div class="food-search mb-4">
    <input type="text" v-model="query" @input="searchFood" placeholder="Search for food..." class="border rounded px-2 py-1 w-full" />

    <ul v-if="results.length" class="border rounded mt-2 max-h-48 overflow-y-auto">
      <li v-for="food in results" :key="food.id" @click="selectFood(food)" class="p-2 hover:bg-gray-100 cursor-pointer">
        {{ food.name }} - {{ food.calories }} kcal
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
