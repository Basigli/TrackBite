<template>
  <div class="diet-selector mb-4 flex flex-wrap gap-2">
    <button
      v-for="diet in diets"
      :key="diet._id"
      @click="$emit('select-diet', diet)"
      :class="[
        'px-4 py-2 rounded-full font-medium transition-colors',
        selectedDiet && diet._id === selectedDiet._id
          ? 'bg-green-500 text-white shadow-md'
          : 'bg-gray-200 text-gray-800 hover:bg-green-100'
      ]"
    >
      {{ diet.name }}
    </button>
  </div>
</template>

<script>
import { onMounted } from 'vue';

export default {
  name: 'DietSelector',
  props: { 
    diets: {
      type: Array,
      default: () => []
    },
    selectedDiet: {
      type: Object,
      default: null
    }
  },
  emits: ['select-diet'],
  setup(props, { emit }) {
    onMounted(() => {
      // Auto-select first diet if none is selected and diets are available
      if (!props.selectedDiet && props.diets.length > 0) {
        emit('select-diet', props.diets[0]);
      }
    });

    return {};
  }
};
</script>
