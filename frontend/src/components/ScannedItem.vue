<template>
  <div class="scanned-item bg-white rounded-xl shadow-sm p-4 mb-4 max-w-md mx-auto">
    <h3 class="font-bold text-gray-800 text-lg mb-3">Scanned Item</h3>
    
    <div class="flex justify-between mb-3 text-gray-700 font-medium">
      <span>{{ item.name }}</span>
      <span>{{ item.calories }} kcal</span>
    </div>

    <div class="flex gap-3 items-center">
      <input
        type="number"
        v-model.number="quantity"
        placeholder="Quantity (g)"
        class="w-28 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
      />
      <button
        @click="addItem"
        class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors font-medium shadow-sm"
      >
        Add
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'ScannedItem',
  props: { item: Object },
  emits: ['add'],
  setup(props, { emit }) {
    const quantity = ref(props.item.quantity || 100);

    const addItem = () => {
      emit('add', { ...props.item, quantity: quantity.value });
    };

    return { quantity, addItem };
  }
};
</script>
