<template>
  <div class="add-food p-4">
    <h1 class="text-2xl font-bold mb-4">Scan Food</h1>

    <!-- Barcode Scanner Toggle Button -->
    <button 
      @click="showScanner = true" 
      class="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
      </svg>
      Scan Barcode
    </button>

    <!-- Barcode Scanner Modal -->
    <BarcodeScannerModal
      :show="showScanner"
      @close="showScanner = false"
      @decode="onDecode"
    />

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
import BarcodeScannerModal from '../components/food/BarcodeScannerModal.vue';
import { useScannedItemStore } from '@/store/scannedItemStore';
import { useUserStore } from '@/store/userStore';
import { notifySuccess, notifyError } from '@/utils/Notifications';

export default {
  name: 'AddFood',
  components: { 
    FoodSearch, 
    ScannedItem,
    ScannedItemList,
    BarcodeScannerModal
  },
  setup() {
    const intakeStore = useIntakeStore();
    const userStore = useUserStore();
    const scannedItem = ref(null);
    const showScanner = ref(false);

    const onDecode = async (result) => {
      console.log('Barcode detected:', result);
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
      onDecode,
      addFoodToDailyIntake 
    };
  }
};
</script>
