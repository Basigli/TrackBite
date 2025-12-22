<template>
  <div class="scanned-item bg-white rounded-xl shadow-sm p-4 mb-4 max-w-md mx-auto">
    <div class="flex justify-between items-center mb-3">
      <div>
        <span class="text-gray-700 font-bold block ">{{ item.name }}</span>
        <span class="text-sm text-gray-500">{{ item.quantity }}{{ item.quantityUnit }}</span>
      </div>
      <button
        @click="showAddModal = true"
        class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors font-medium shadow-sm"
      >
        Add
      </button>
    </div>

    <AddScannedItem
      :item="item"
      :show="showAddModal"
      @close="showAddModal = false"
      @add="handleAdd"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import AddScannedItem from './AddScannedItem.vue'

export default {
  name: 'ScannedItem',
  components: {
    AddScannedItem
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  emits: ['add'],
  setup(props, { emit }) {
    const showAddModal = ref(false)

    const handleAdd = (foodItem) => {
      emit('add', foodItem)
    }

    return {
      showAddModal,
      handleAdd
    }
  }
}
</script>