<template>
  <div class="scanned-item-list">
    <h2 class="text-xl font-bold mb-4 text-gray-800">Saved Scanned Items</h2>
    
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-500">Loading saved items...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <div v-else-if="!items.length" class="text-center py-8 bg-gray-50 rounded-lg">
      <p class="text-gray-500">No saved scanned items yet</p>
      <p class="text-gray-400 text-sm mt-2">Scan a barcode to get started!</p>
    </div>

    <div v-else class="space-y-3">
      <ScannedItem
        v-for="item in items"
        :key="item._id"
        :item="item"
        @add="handleAdd"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useScannedItemStore } from '@/store/scannedItemStore';
import { useUserStore } from '@/store/userStore';
import ScannedItem from './ScannedItem.vue';

export default {
  name: 'ScannedItemList',
  components: {
    ScannedItem
  },
  emits: ['add'],
  setup(props, { emit }) {
    const scannedItemStore = useScannedItemStore();
    const userStore = useUserStore();
    const loading = ref(true);
    const error = ref(null);

    // Convert the Map to an array for v-for
    const items = computed(() => {
      return Array.from(scannedItemStore.scannedItems.values());
    });

    const loadSavedItems = async () => {
      try {
        loading.value = true;
        error.value = null;
        
        // Check if user is logged in
        if (!userStore.user?._id) {
          error.value = 'Please log in to view saved items';
          loading.value = false;
          return;
        }

        // Fetch all scanned items for the user
        await scannedItemStore.fetchScannedItems(userStore.user._id);
        
        loading.value = false;
      } catch (err) {
        console.error('Error loading saved items:', err);
        error.value = 'Failed to load saved items';
        loading.value = false;
      }
    };

    const handleAdd = (food) => {
      emit('add', food);
    };

    onMounted(() => {
      loadSavedItems();
    });

    return {
      items,
      loading,
      error,
      handleAdd,
      loadSavedItems
    };
  }
};
</script>

<style scoped>
.scanned-item-list {
  max-width: 800px;
  margin: 0 auto;
}
</style>