<template>
  <div class="relative w-40 h-40 flex items-center justify-center">
    <svg class="w-full h-full transform -rotate-90">
      <!-- Background circle -->
      <circle
        class="text-gray-200"
        stroke="currentColor"
        stroke-width="10"
        fill="transparent"
        :r="radius"
        :cx="center"
        :cy="center"
      />

      <!-- Progress circle with gradient -->
      <circle
        :stroke="gradientColor"
        stroke-width="10"
        stroke-linecap="round"
        fill="transparent"
        :r="radius"
        :cx="center"
        :cy="center"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        class="transition-all duration-700 ease-out"
      />
    </svg>

    <!-- Text inside the circle -->
    <div class="absolute text-center">
      <p class="text-2xl font-bold text-gray-800">{{ percentage }}%</p>
      <p class="text-sm text-gray-500 mt-1">{{ current.toFixed(0) }} / {{ goal }} kcal</p>
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
  Math.round((props.current / props.goal) * 100)
);

const dashOffset = computed(() => {
  const progress = Math.min(1, props.current / props.goal);
  return circumference - progress * circumference;
});

const gradientColor = computed(() => {
  if (percentage.value >= 100) return "#10B981"; // green
  if (percentage.value >= 75) return "#F59E0B";  // amber
  return "#3B82F6"; // blue default
});
</script>