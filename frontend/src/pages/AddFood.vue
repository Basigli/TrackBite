<template>
  <div class="add-food p-4">
    <h1 class="text-2xl font-bold mb-4">Add Food</h1>

    <!-- Search for food items -->
    <FoodSearch @select-food="addFoodToDailyIntake" />

    <!-- Optional: scanned item -->
    <ScannedItem v-if="scannedItem" :item="scannedItem" @add="addFoodToDailyIntake"/>

    <!-- Display currently selected items to add -->
    <div v-if="selectedFoods.length" class="mt-4">
      <h2 class="text-xl font-semibold mb-2">Selected Foods</h2>
      <ul>
        <li v-for="(food, index) in selectedFoods" :key="index" class="flex justify-between border p-2 rounded mb-1">
          <span>{{ food.name }} ({{ food.quantity }}g)</span>
          <span>{{ food.calories }} kcal</span>
          <button @click="removeFood(index)" class="text-red-500 hover:underline">Remove</button>
        </li>
      </ul>
      <button @click="submitFoods" class="mt-2 bg-green-500 text-white px-4 py-2 rounded">Add to Daily Intake</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useIntakeStore } from '../store/intakeStore';
import FoodSearch from '../components/FoodSearch.vue';
import ScannedItem from '../components/ScannedItem.vue';

export default {
  name: 'AddFood',
  components: { FoodSearch, ScannedItem },
  setup() {
    const intakeStore = useIntakeStore();
    const selectedFoods = ref([]);
    const scannedItem = ref(null); // for barcode scanning

    const addFoodToDailyIntake = (food) => {
      selectedFoods.value.push(food);
    };

    const removeFood = (index) => {
      selectedFoods.value.splice(index, 1);
    };

    const submitFoods = async () => {
      if (!selectedFoods.value.length) return;
      const dailyIntakeId = intakeStore.dailyIntake.id;
      for (const food of selectedFoods.value) {
        await intakeStore.addFoodItem(dailyIntakeId, food);
      }
      selectedFoods.value = [];
      alert('Foods added!');
    };

    return { selectedFoods, scannedItem, addFoodToDailyIntake, removeFood, submitFoods };
  }
};
</script>
