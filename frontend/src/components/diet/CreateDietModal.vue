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
          <h2 class="text-2xl font-bold text-gray-800">
            {{ isEditMode ? 'Edit Diet' : 'Create New Diet' }}
          </h2>
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
            v-model="dietData.name"
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
            v-model.number="dietData.calories"
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
                <span class="text-sm font-semibold text-gray-800">{{ dietData.macros.protein }}%</span>
              </div>
              <input
                v-model.number="dietData.macros.protein"
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
                <span class="text-sm font-semibold text-gray-800">{{ dietData.macros.carbohydrates }}%</span>
              </div>
              <input
                v-model.number="dietData.macros.carbohydrates"
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
                <span class="text-sm font-semibold text-gray-800">{{ dietData.macros.fat }}%</span>
              </div>
              <input
                v-model.number="dietData.macros.fat"
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
        <div v-if="dietData.calories > 0" class="bg-gray-50 rounded-lg p-4">
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
            @click="handleSubmit"
            :disabled="!isValid"
            class="flex-1 bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
          >
            {{ isEditMode ? 'Update Diet' : 'Create Diet' }}
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
  },
  userId: {
    type: String,
    required: true
  },
  diet: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'create', 'update'])

const error = ref('')

// Determina se siamo in modalità edit
const isEditMode = computed(() => props.diet !== null)

// Funzione helper per calcolare percentuali dai grammi
const calculatePercentageFromGrams = (grams, totalCalories, macroName) => {
  const caloriesPerGram = macroName === 'fat' ? 9 : 4
  const macroCalories = grams * caloriesPerGram
  return Math.round((macroCalories / totalCalories) * 100)
}

// Inizializza i dati del form
const initializeDietData = () => {
  if (props.diet) {
    // Modalità edit: carica i dati esistenti
    const proteinMacro = props.diet.macros.find(m => m.name === 'protein')
    const carbsMacro = props.diet.macros.find(m => m.name === 'carbohydrates')
    const fatMacro = props.diet.macros.find(m => m.name === 'fat')

    return {
      name: props.diet.name,
      calories: props.diet.caloriesAmount,
      macros: {
        protein: proteinMacro ? calculatePercentageFromGrams(proteinMacro.totalAmount, props.diet.caloriesAmount, 'protein') : 30,
        carbohydrates: carbsMacro ? calculatePercentageFromGrams(carbsMacro.totalAmount, props.diet.caloriesAmount, 'carbohydrates') : 40,
        fat: fatMacro ? calculatePercentageFromGrams(fatMacro.totalAmount, props.diet.caloriesAmount, 'fat') : 30
      }
    }
  } else {
    // Modalità create: valori di default
    return {
      name: '',
      calories: 2000,
      macros: {
        protein: 30,
        carbohydrates: 40,
        fat: 30
      }
    }
  }
}

const dietData = ref(initializeDietData())

const totalPercentage = computed(() => {
  return dietData.value.macros.protein + 
         dietData.value.macros.carbohydrates + 
         dietData.value.macros.fat
})

const isValid = computed(() => {
  return dietData.value.name.trim() !== '' &&
         dietData.value.calories > 0 &&
         totalPercentage.value === 100
})

const calculateMacroGrams = (macroName) => {
  const percentage = dietData.value.macros[macroName]
  const calories = dietData.value.calories * (percentage / 100)
  const caloriesPerGram = macroName === 'fat' ? 9 : 4
  return (calories / caloriesPerGram).toFixed(1)
}

const calculateMacroCalories = (macroName) => {
  const percentage = dietData.value.macros[macroName]
  return Math.round(dietData.value.calories * (percentage / 100))
}

const resetForm = () => {
  dietData.value = initializeDietData()
  error.value = ''
}

const closeModal = () => {
  resetForm()
  emit('close')
}

const handleSubmit = () => {
  if (!isValid.value) {
    error.value = 'Please fill all fields correctly and ensure macros total 100%'
    return
  }

  // Crea l'array di Nutrient
  const macros = [
    {
      name: 'protein',
      unit: 'g',
      totalAmount: parseFloat(calculateMacroGrams('protein')),
      amount100g: 0,
      amountPerServing: 0
    },
    {
      name: 'carbohydrates',
      unit: 'g',
      totalAmount: parseFloat(calculateMacroGrams('carbohydrates')),
      amount100g: 0,
      amountPerServing: 0
    },
    {
      name: 'fat',
      unit: 'g',
      totalAmount: parseFloat(calculateMacroGrams('fat')),
      amount100g: 0,
      amountPerServing: 0
    }
  ]

  const dietPayload = {
    name: dietData.value.name,
    caloriesAmount: dietData.value.calories,
    macros: macros,
    userId: props.userId
  }

  console.log(dietPayload)

  if (isEditMode.value) {
    // Modalità edit: emetti update senza userId nel payload (solo i dati da aggiornare)
    const updatePayload = {
      name: dietData.value.name,
      caloriesAmount: dietData.value.calories,
      macros: macros
    }
    emit('update', props.diet._id, updatePayload)
  } else {
    // Modalità create: emetti create con userId
    emit('create', dietPayload)
  }

  resetForm()
}

// Reinizializza quando cambia la prop diet o show
watch(() => [props.show, props.diet], () => {
  if (props.show) {
    dietData.value = initializeDietData()
    error.value = ''
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