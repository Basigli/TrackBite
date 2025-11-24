<template>
  <div class="diet-selector mb-4 flex flex-wrap gap-2">
    <button
      v-for="diet in diets"
      :key="diet.id"
      @click="$emit('select-diet', diet)"
      :class="[
        'px-4 py-2 rounded-full font-medium transition-colors',
        diet.id === selectedDiet?.id
          ? 'bg-green-500 text-white shadow-md'
          : 'bg-gray-200 text-gray-800 hover:bg-green-100'
      ]"
    >
      {{ diet.name }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'DietSelector',
  props: { diets: Array, selectedDiet: Object },
  emits: ['select-diet'],
};
</script>
