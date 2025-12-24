<template>
  <!-- Modal Overlay -->
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    style="background: rgba(0, 0, 0, 0.8)"
    @click.self="closeModal"
  >
    <!-- Modal Content -->
    <div class="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-800">Create New Diet</h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div class="p-6 space-y-4">
        <!-- Diet Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Diet Name
          </label>
          <input
            v-model="newDiet.name"
            type="text"
            class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., Weight Loss Plan"
          />
        </div>

        <!-- Total Calories -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Total Daily Calories
          </label>
          <input
            v-model.number="newDiet.calories"
            type="number"
            min="0"
            step="100"
            class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., 2000"
          />
        </div>

        <!-- Macros Percentage -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Macros Distribution (%)
          </label>

          <div class="space-y-4">
            <!-- Protein -->
            <div>
              <div class="flex justify-between mb-2">
                <label class="text-sm text-gray-600">Protein</label>
                <span class="text-sm font-semibold text-gray-800">{{ newDiet.macros.protein }}%</span>
              </div>
              <input
                v-model.number="newDiet.macros.protein"
                type="range"
                min="0"
                max="100"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
              <p class="text-xs text-gray-500 mt-1">
                {{ calculateMacroGrams('protein') }}g
              </p>
            </div>

            <!-- Carbohydrates -->
            <div>
              <div class="flex justify-between mb-2">
                <label class="text-sm text-gray-600">Carbohydrates</label>
                <span class="text-sm font-semibold text-gray-800">{{ newDiet.macros.carbohydrates }}%</span>
              </div>
              <input
                v-model.number="newDiet.macros.carbohydrates"
                type="range"
                min="0"
                max="100"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
              <p class="text-xs text-gray-500 mt-1">
                {{ calculateMacroGrams('carbohydrates') }}g
              </p>
            </div>

            <!-- Fat -->
            <div>
              <div class="flex justify-between mb-2">
                <label class="text-sm text-gray-600">Fat</label>
                <span class="text-sm font-semibold text-gray-800">{{ newDiet.macros.fat }}%</span>
              </div>
              <input
                v-model.number="newDiet.macros.fat"
                type="range"
                min="0"
                max="100"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
              <p class="text-xs text-gray-500 mt-1">
                {{ calculateMacroGrams('fat') }}g
              </p>
            </div>
          </div>

          <!-- Total Percentage Warning -->
          <div 
            class="mt-4 p-3 rounded-lg"
            :class="totalPercentage === 100 
              ? 'bg-green-100 border border-green-300 text-green-800' 
              : 'bg-red-100 border border-red-300 text-red-800'"
          >
            <div class="flex items-center gap-2">
              <svg v-if="totalPercentage === 100" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <span class="text-sm font-medium">
                Total: {{ totalPercentage }}% 
                {{ totalPercentage === 100 ? '✓ Perfect!' : `(${totalPercentage > 100 ? 'Too high' : 'Too low'})` }}
              </span>
            </div>
          </div>
        </div>

        <!-- Preview -->
        <div v-if="newDiet.calories > 0" class="bg-gray-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-700 mb-3">Preview</h3>
          <div class="grid grid-cols-3 gap-3 text-center">
            <div class="bg-white rounded-lg p-3 shadow-sm">
              <div class="text-xs text-gray-500 mb-1">Protein</div>
              <div class="font-bold text-green-600">{{ calculateMacroGrams('protein') }}g</div>
              <div class="text-xs text-gray-400">{{ calculateMacroCalories('protein') }} kcal</div>
            </div>
            <div class="bg-white rounded-lg p-3 shadow-sm">
              <div class="text-xs text-gray-500 mb-1">Carbs</div>
              <div class="font-bold text-blue-600">{{ calculateMacroGrams('carbohydrates') }}g</div>
              <div class="text-xs text-gray-400">{{ calculateMacroCalories('carbohydrates') }} kcal</div>
            </div>
            <div class="bg-white rounded-lg p-3 shadow-sm">
              <div class="text-xs text-gray-500 mb-1">Fat</div>
              <div class="font-bold text-orange-600">{{ calculateMacroGrams('fat') }}g</div>
              <div class="text-xs text-gray-400">{{ calculateMacroCalories('fat') }} kcal</div>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-2">
          <button
            @click="closeModal"
            class="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            @click="handleCreate"
            :disabled="!isValid"
            class="flex-1 bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
          >
            Create Diet
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'create'])

const error = ref('')

const newDiet = ref({
  name: '',
  calories: 2000,
  macros: {
    protein: 30,
    carbohydrates: 40,
    fat: 30
  }
})

const totalPercentage = computed(() => {
  return newDiet.value.macros.protein + 
         newDiet.value.macros.carbohydrates + 
         newDiet.value.macros.fat
})

const isValid = computed(() => {
  return newDiet.value.name.trim() !== '' &&
         newDiet.value.calories > 0 &&
         totalPercentage.value === 100
})

const calculateMacroGrams = (macroName) => {
  const percentage = newDiet.value.macros[macroName]
  const calories = newDiet.value.calories * (percentage / 100)
  const caloriesPerGram = macroName === 'fat' ? 9 : 4
  return (calories / caloriesPerGram).toFixed(1)
}

const calculateMacroCalories = (macroName) => {
  const percentage = newDiet.value.macros[macroName]
  return Math.round(newDiet.value.calories * (percentage / 100))
}

const resetForm = () => {
  newDiet.value = {
    name: '',
    calories: 2000,
    macros: {
      protein: 30,
      carbohydrates: 40,
      fat: 30
    }
  }
  error.value = ''
}

const closeModal = () => {
  resetForm()
  emit('close')
}

const handleCreate = () => {
  if (!isValid.value) {
    error.value = 'Please fill all fields correctly and ensure macros total 100%'
    return
  }

  const macrosPercentage = new Map([
    ['protein', newDiet.value.macros.protein],
    ['carbohydrates', newDiet.value.macros.carbohydrates],
    ['fat', newDiet.value.macros.fat]
  ])

  emit('create', {
    name: newDiet.value.name,
    calories: newDiet.value.calories,
    macrosPercentage
  })

  resetForm()
}

// Reset form when modal is closed
watch(() => props.show, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})
</script>

<style scoped>
input[type="range"] {
  -webkit-appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #10b981;
  cursor: pointer;
  border-radius: 50%;
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #10b981;
  cursor: pointer;
  border-radius: 50%;
  border: none;
}
</style>
