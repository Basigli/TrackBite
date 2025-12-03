<template>
  <div class="add-food p-4">
    <h1 class="text-2xl font-bold mb-4">Add Food</h1>

    <!-- Barcode Scanner Toggle Button -->
    <button 
      @click="toggleScanner" 
      class="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
    >
      <span v-if="!showScanner">Scan Barcode</span>
      <span v-else>Close Scanner</span>
    </button>

    <!-- Barcode Scanner Component -->
    <div v-if="showScanner" class="mb-4 border-2 border-blue-500 rounded p-4">
      <h2 class="text-lg font-semibold mb-2">Barcode Scanner</h2>
      <StreamBarcodeReader
        @decode="onDecode"
        @loaded="onLoaded"
        class="barcode-scanner"
      ></StreamBarcodeReader>
      <p v-if="scannerError" class="text-red-500 mt-2">{{ scannerError }}</p>
      <p v-if="lastScannedCode" class="text-green-600 mt-2">
        Last scanned: {{ lastScannedCode }}
      </p>
    </div>

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
import { useIntakeStore } from '@/store/intakeStore';
import FoodSearch from '../components/FoodSearch.vue';
import ScannedItem from '../components/ScannedItem.vue';
import { StreamBarcodeReader } from 'vue-barcode-reader';
import { useScannedItemStore } from '@/store/scannedItemStore';
import { useUserStore } from '@/store/userStore';

export default {
  name: 'AddFood',
  components: { 
    FoodSearch, 
    ScannedItem,
    StreamBarcodeReader
  },
  setup() {
    const intakeStore = useIntakeStore();
    const selectedFoods = ref([]);
    const scannedItem = ref(null);
    const showScanner = ref(false);
    const scannerError = ref(null);
    const lastScannedCode = ref(null);

    const toggleScanner = () => {
      showScanner.value = !showScanner.value;
      if (!showScanner.value) {
        scannerError.value = null;
        lastScannedCode.value = null;
      }
    };

    const onDecode = async (result) => {
      console.log('Barcode detected:', result);
      lastScannedCode.value = result;
      const localScannedItem = ref(null);
      
      try {
        const scannedItemStore = useScannedItemStore()
        if (!scannedItem) {
          scannerError.value = 'Product not found in database';
        } else {
          scannerError.value = null;
        }
        localScannedItem.value = await scannedItemStore.fetchScannedItem(result);
        scannedItem.value = localScannedItem.value;
      } catch (error) {
        console.error('Error fetching food data:', error);
        scannerError.value = 'Error fetching product information';
      }
      try {
        const userStore = useUserStore();
        userStore.addSavedScannedItem(localScannedItem.value._id);
      } catch (error) {
        console.error('Error updating user saved items:', error);
        scannerError.value = 'Error updating user saved items';
      }


    };

    const onLoaded = () => {
      console.log('Scanner loaded successfully');
      scannerError.value = null;
    };

    const addFoodToDailyIntake = (food) => {
      selectedFoods.value.push(food);
      // Clear scanned item after adding
      scannedItem.value = null;
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

    return { 
      selectedFoods, 
      scannedItem, 
      showScanner,
      scannerError,
      lastScannedCode,
      toggleScanner,
      onDecode,
      onLoaded,
      addFoodToDailyIntake, 
      removeFood, 
      submitFoods 
    };
  }
};
</script>

<style scoped>
.barcode-scanner {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}
</style>