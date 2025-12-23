<template>
  <div class="add-food p-4">
    <h1 class="text-2xl font-bold mb-4">Scan Food</h1>

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
      <p v-if="lastScannedCode" class="text-green-600 mt-2">
        Last scanned: {{ lastScannedCode }}
      </p>
    </div>

    <!-- Search for food items -->
    <FoodSearch @select-food="addFoodToDailyIntake" />

    <!-- Optional: scanned item -->
    <ScannedItem v-if="scannedItem" :item="scannedItem" @add="addFoodToDailyIntake"/>

    <!-- Saved Scanned Items List -->
    <div class="mt-6 mb-6">
      <ScannedItemList @add="addFoodToDailyIntake" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useIntakeStore } from '@/store/intakeStore';
import FoodSearch from '../components/food/FoodSearch.vue';
import ScannedItem from '../components/food/ScannedItem.vue';
import ScannedItemList from '../components/food/ScannedItemList.vue';
import { StreamBarcodeReader } from 'vue-barcode-reader';
import { useScannedItemStore } from '@/store/scannedItemStore';
import { useUserStore } from '@/store/userStore';
import { notifySuccess, notifyError } from '@/utils/Notifications';

export default {
  name: 'AddFood',
  components: { 
    FoodSearch, 
    ScannedItem,
    ScannedItemList,
    StreamBarcodeReader
  },
  setup() {
    const intakeStore = useIntakeStore();
    const userStore = useUserStore();
    const scannedItem = ref(null);
    const showScanner = ref(false);
    const lastScannedCode = ref(null);

    const toggleScanner = () => {
      showScanner.value = !showScanner.value;
      if (!showScanner.value) {
        lastScannedCode.value = null;
      }
    };

    const onDecode = async (result) => {
      console.log('Barcode detected:', result);
      lastScannedCode.value = result;
      const localScannedItem = ref(null);
      
      try {
        const scannedItemStore = useScannedItemStore()
        localScannedItem.value = await scannedItemStore.fetchScannedItem(result);
        
        if (!localScannedItem.value) {
          notifyError('Product not found in database');
          return;
        }
        
        scannedItem.value = localScannedItem.value;
        notifySuccess(`Product scanned: ${localScannedItem.value.name}`);
      } catch (error) {
        console.error('Error fetching food data:', error);
        notifyError('Error fetching product information');
        return;
      }
      
      try {
        const userStore = useUserStore();
        userStore.addSavedScannedItem(localScannedItem.value._id);
        showScanner.value = false;
      } catch (error) {
        console.error('Error updating user saved items:', error);
        notifyError('Error updating user saved items');
      }
    };

    const onLoaded = () => {
      console.log('Scanner loaded successfully');
    };

    const addFoodToDailyIntake = (food) => {
      // Clear scanned item after adding
      scannedItem.value = null;
      intakeStore.fetchDailyIntake(userStore.user._id);
      if (intakeStore.dailyIntake._id == "") {
        intakeStore.createDailyIntake(userStore.user._id, new Date().toISOString().substr(0, 10));
      }
      intakeStore.addToDailyIntake(userStore.user._id, food, new Date().toISOString().substr(0, 10));
      notifySuccess('Food item added to daily intake!');
    };


    return {
      scannedItem, 
      showScanner,
      lastScannedCode,
      toggleScanner,
      onDecode,
      onLoaded,
      addFoodToDailyIntake 
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