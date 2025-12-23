<template>
  <div class="macro-breakdown p-6 bg-white rounded-xl shadow-lg">
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
            {{ currentProtein.toFixed(1) }}g / {{ targetProtein.toFixed(1) }}g
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            class="h-4 rounded-full transition-all duration-300"
            :class="MACRO_COLORS.protein.light"
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
            {{ currentCarbs.toFixed(1) }}g / {{ targetCarbs.toFixed(1) }}g
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            class="h-4 rounded-full transition-all duration-300"
            :class="MACRO_COLORS.carbohydrates.light"
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
            {{ currentFat.toFixed(1) }}g / {{ targetFat.toFixed(1) }}g
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            class="h-4 rounded-full transition-all duration-300"
            :class="MACRO_COLORS.fat.light"
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
import { useIntakeStore } from '../../store/intakeStore';
import { useDietStore } from '../../store/dietStore';
import { MACRO_COLORS } from '../../constants/theme';

const intakeStore = useIntakeStore();
const dietStore = useDietStore();

// Get current macro values from daily intake
const currentProtein = computed(() => {
  const proteinMacro = intakeStore.dailyIntake.totalMacros?.find(
    m => ['protein', 'proteins'].includes(m.name.toLowerCase())
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

// Calculate target macros from diet
const targetProtein = computed(() => {
  if (!dietStore.selectedDiet) return 0;
  const proteinNutrient = dietStore.selectedDiet.macros.find(macro => macro.name.toLowerCase() === 'protein');
  return proteinNutrient?.totalAmount || 0;
});

const targetCarbs = computed(() => {
  if (!dietStore.selectedDiet) return 0;
  const carbsNutrient = dietStore.selectedDiet.macros.find(macro => macro.name.toLowerCase() === 'carbohydrates');
  return carbsNutrient?.totalAmount || 0;
});

const targetFat = computed(() => {
  if (!dietStore.selectedDiet) return 0;
  const fatNutrient = dietStore.selectedDiet.macros.find(macro => macro.name.toLowerCase() === 'fat');
  return fatNutrient?.totalAmount || 0;
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