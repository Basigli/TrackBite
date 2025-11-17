<template>
  <div class="relative w-40 h-40 flex items-center justify-center">
    <svg class="w-full h-full transform -rotate-90">
      <!-- Background circle -->
      <circle
        class="text-gray-300"
        stroke="currentColor"
        stroke-width="10"
        fill="transparent"
        :r="radius"
        :cx="center"
        :cy="center"
      />

      <!-- Progress circle -->
      <circle
        class="text-blue-500 transition-all duration-500"
        stroke="currentColor"
        stroke-width="10"
        stroke-linecap="round"
        fill="transparent"
        :r="radius"
        :cx="center"
        :cy="center"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
      />
    </svg>

    <!-- Text inside the circle -->
    <div class="absolute text-center">
      <p class="text-xl font-bold">{{ percentage }}%</p>
      <p class="text-sm text-gray-500">{{ current }} / {{ goal }} kcal</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  current: { type: Number, required: true }, // calories consumed
  goal: { type: Number, required: true },    // daily target
});

// SVG math
const radius = 70;
const center = 80;
const circumference = 2 * Math.PI * radius;

const percentage = computed(() =>
  Math.min(100, Math.round((props.current / props.goal) * 100))
);

const dashOffset = computed(() => {
  return circumference - (props.current / props.goal) * circumference;
});
</script>
