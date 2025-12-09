<template>
  <div class="macro-breakdown bg-white rounded-lg shadow p-6">
    <h2 class="text-2xl font-bold mb-4">Macro Breakdown</h2>
    
    <div v-if="!dietStore.selectedDiet" class="text-gray-500">
      No diet selected. Please select a diet to see macro targets.
    </div>

    <div v-else class="space-y-4">
      <!-- Protein -->
      <div class="macro-item">
        <div class="flex justify-between items-center mb-2">
          <span class="font-semibold text-gray-700">Protein</span>
          <span class="text-sm text-gray-600">
            {{ currentProtein }}g / {{ targetProtein }}g
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            class="bg-blue-500 h-4 rounded-full transition-all duration-300"
            :style="{ width: proteinPercentage + '%' }"
          ></div>
        </div>
        <p class="text-xs text-gray-500 mt-1">
          {{ proteinPercentage.toFixed(1) }}% of target
        </p>
      </div>

      <!-- Carbohydrates -->
      <div class="macro-item">
        <div class="flex justify-between items-center mb-2">
          <span class="font-semibold text-gray-700">Carbohydrates</span>
          <span class="text-sm text-gray-600">
            {{ currentCarbs }}g / {{ targetCarbs }}g
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            class="bg-green-500 h-4 rounded-full transition-all duration-300"
            :style="{ width: carbsPercentage + '%' }"
          ></div>
        </div>
        <p class="text-xs text-gray-500 mt-1">
          {{ carbsPercentage.toFixed(1) }}% of target
        </p>
      </div>

      <!-- Fat -->
      <div class="macro-item">
        <div class="flex justify-between items-center mb-2">
          <span class="font-semibold text-gray-700">Fat</span>
          <span class="text-sm text-gray-600">
            {{ currentFat }}g / {{ targetFat }}g
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            class="bg-yellow-500 h-4 rounded-full transition-all duration-300"
            :style="{ width: fatPercentage + '%' }"
          ></div>
        </div>
        <p class="text-xs text-gray-500 mt-1">
          {{ fatPercentage.toFixed(1) }}% of target
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useIntakeStore } from '../store/intakeStore';
import { useDietStore } from '../store/dietStore';

const intakeStore = useIntakeStore();
const dietStore = useDietStore();

// Get current macro values from daily intake
const currentProtein = computed(() => {
  const proteinMacro = intakeStore.dailyIntake.totalMacros?.find(
    m => m.name.toLowerCase() === 'protein'
  );
  return proteinMacro?.totalAmount || 0;
});

const currentCarbs = computed(() => {
  const carbsMacro = intakeStore.dailyIntake.totalMacros?.find(
    m => m.name.toLowerCase() === 'carbohydrates'
  );
  return carbsMacro?.totalAmount || 0;
});

const currentFat = computed(() => {
  const fatMacro = intakeStore.dailyIntake.totalMacros?.find(
    m => m.name.toLowerCase() === 'fat'
  );
  return fatMacro?.totalAmount || 0;
});

// Calculate target macros from diet (using standard ratios if not specified)
// Standard ratios: Protein 30%, Carbs 40%, Fat 30%
const targetProtein = computed(() => {
  if (!dietStore.selectedDiet) return 0;
  const calories = dietStore.selectedDiet.caloriesAmount;
  return Math.round((calories * 0.30) / 4); // 4 calories per gram of protein
});

const targetCarbs = computed(() => {
  if (!dietStore.selectedDiet) return 0;
  const calories = dietStore.selectedDiet.caloriesAmount;
  return Math.round((calories * 0.40) / 4); // 4 calories per gram of carbs
});

const targetFat = computed(() => {
  if (!dietStore.selectedDiet) return 0;
  const calories = dietStore.selectedDiet.caloriesAmount;
  return Math.round((calories * 0.30) / 9); // 9 calories per gram of fat
});

// Calculate percentages
const proteinPercentage = computed(() => {
  if (targetProtein.value === 0) return 0;
  return Math.min((currentProtein.value / targetProtein.value) * 100, 100);
});

const carbsPercentage = computed(() => {
  if (targetCarbs.value === 0) return 0;
  return Math.min((currentCarbs.value / targetCarbs.value) * 100, 100);
});

const fatPercentage = computed(() => {
  if (targetFat.value === 0) return 0;
  return Math.min((currentFat.value / targetFat.value) * 100, 100);
});

const caloriesPercentage = computed(() => {
  if (!dietStore.selectedDiet || dietStore.selectedDiet.caloriesAmount === 0) return 0;
  return Math.min((intakeStore.dailyIntake.totalCalories / dietStore.selectedDiet.caloriesAmount) * 100, 100);
});

// Dynamic color based on calories percentage
const caloriesClass = computed(() => {
  const percentage = caloriesPercentage.value;
  if (percentage < 80) return 'bg-blue-500';
  if (percentage < 100) return 'bg-green-500';
  if (percentage < 110) return 'bg-yellow-500';
  return 'bg-red-500';
});
</script>

<style scoped>
.macro-item {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>