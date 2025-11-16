<template>
  <div class="diet-selector mb-4 flex gap-2">
    <button v-for="diet in diets" :key="diet.id" 
            @click="$emit('select-diet', diet)"
            :class="['px-4 py-2 rounded', diet.id === selectedDiet?.id ? 'bg-green-500 text-white' : 'bg-gray-200']">
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
