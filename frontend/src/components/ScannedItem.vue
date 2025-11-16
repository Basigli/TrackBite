<template>
  <div class="scanned-item border p-3 rounded mb-4 bg-gray-50">
    <h3 class="font-semibold mb-2">Scanned Item</h3>
    <div class="flex justify-between mb-2">
      <span>{{ item.name }}</span>
      <span>{{ item.calories }} kcal</span>
    </div>
    <div class="flex gap-2">
      <input type="number" v-model.number="quantity" placeholder="Quantity (g)" class="border px-2 py-1 rounded w-24"/>
      <button @click="addItem" class="bg-green-500 text-white px-3 py-1 rounded">Add</button>
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
