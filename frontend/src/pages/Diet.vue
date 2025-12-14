<template>
  <div class="diet-page p-6 max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Diet Management</h1>

    <!-- Create New Diet Button -->
    <button
      v-if="!showCreateForm"
      @click="showCreateForm = true"
      class="mb-6 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold shadow-md flex items-center gap-2"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Create New Diet
    </button>

    <!-- Create Diet Form -->
    <div v-if="showCreateForm" class="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-gray-800">Create New Diet</h2>
        <button
          @click="closeCreateForm"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="space-y-4">
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
            @click="closeCreateForm"
            class="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            @click="createDiet"
            :disabled="!isValid"
            class="flex-1 bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
          >
            Create Diet
          </button>
        </div>
      </div>
    </div>

    <!-- Diet Selector -->
    <DietSelector
      v-if="diets.length > 0"
      :diets="diets"
      :selectedDiet="selectedDiet"
      @select-diet="selectDiet"
      class="mb-6"
    />

    <!-- Selected Diet Details -->
    <div v-if="selectedDiet" class="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">{{ selectedDiet.name }}</h2>
          <p class="text-gray-600 mt-1">
            <span class="font-semibold">{{ selectedDiet.caloriesAmount }}</span> kcal/day
          </p>
        </div>
        <div class="flex gap-3">
          <button
            @click="editDiet(selectedDiet)"
            class="text-blue-500 hover:text-blue-700 font-medium transition-colors"
          >
            Edit
          </button>
          <button
            @click="deleteDiet(selectedDiet._id)"
            class="text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <!-- Macros Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          v-for="macro in selectedDiet.macros" 
          :key="macro.name"
          class="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 border border-green-200"
        >
          <div class="text-sm text-gray-600 mb-2">{{ capitalizeFirst(macro.name) }}</div>
          <div class="text-3xl font-bold text-gray-800 mb-1">{{ macro.totalAmount }}g</div>
          <div class="text-xs text-gray-500">
            {{ calculateMacroPercentage(macro, selectedDiet.caloriesAmount) }}%
          </div>
        </div>
      </div>
    </div>

    <!-- All Diets List -->
    <div v-if="diets.length > 0" class="space-y-4">
      <h2 class="text-xl font-bold text-gray-800">All Your Diets</h2>
      
      <DietPlan
        v-for="diet in diets"
        :key="diet._id"
        :diet="diet"
        @update-diet="updateDiet"
        @delete-diet="deleteDiet"
      />
    </div>

    <!-- Empty State -->
    <div v-else-if="!showCreateForm" class="text-center py-12">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="text-xl font-semibold text-gray-700 mb-2">No Diets Yet</h3>
      <p class="text-gray-500 mb-4">Create your first diet plan to get started!</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { DietBuilder } from '../utils/DietBuilder'
import DietSelector from '../components/DietSelector.vue'
import DietPlan from '../components/DietPlan.vue'
import { useDietStore } from '../store/dietStore'
import { useUserStore } from '../store/userStore'

export default {
  name: 'Diet',
  components: {
    DietSelector,
    DietPlan
  },
  setup() {
    const dietStore = useDietStore()
    const userStore = useUserStore()
    
    // Use storeToRefs to maintain reactivity with the store
    const { selectedDiet } = storeToRefs(dietStore)
    
    const showCreateForm = ref(false)
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

    const diets = computed(() => dietStore.diets)

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

    const calculateMacroPercentage = (macro, totalCalories) => {
      const caloriesPerGram = macro.name === 'fat' ? 9 : 4
      const macroCalories = macro.totalAmount * caloriesPerGram
      return ((macroCalories / totalCalories) * 100).toFixed(1)
    }

    const capitalizeFirst = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }

    const closeCreateForm = () => {
      showCreateForm.value = false
      error.value = ''
      newDiet.value = {
        name: '',
        calories: 2000,
        macros: {
          protein: 30,
          carbohydrates: 40,
          fat: 30
        }
      }
    }

    const createDiet = async () => {
      if (!isValid.value) {
        error.value = 'Please fill all fields correctly and ensure macros total 100%'
        return
      }

      try {
        const macrosPercentage = new Map([
          ['protein', newDiet.value.macros.protein],
          ['carbohydrates', newDiet.value.macros.carbohydrates],
          ['fat', newDiet.value.macros.fat]
        ])

        const dietBuilder = new DietBuilder(
          newDiet.value.name,
          newDiet.value.calories,
          macrosPercentage,
          userStore.user._id
        )
       
        const diet = dietBuilder.build()
        console.log("Built diet:", diet)
        await dietStore.createDiet(diet)
        
        closeCreateForm()
      } catch (err) {
        console.error('Error creating diet:', err)
        error.value = 'Failed to create diet. Please try again.'
      }
    }

    const selectDiet = (diet) => {
      console.log('Parent - selectDiet called with:', diet)
      dietStore.selectDiet(diet)
      userStore.updateUser({ activeDietId: diet._id })
    }

    const editDiet = (diet) => {
      // TODO: Implement edit functionality
      console.log('Edit diet:', diet)
    }

    const updateDiet = async (dietId, updates) => {
      await dietStore.updateDiet(dietId, userStore.user._id, updates)
    }

    const deleteDiet = async (dietId) => {
      if (confirm('Are you sure you want to delete this diet?')) {
        await dietStore.deleteDiet(dietId, userStore.user._id)
        if (selectedDiet.value && selectedDiet.value._id === dietId) {
          selectedDiet.value = null
        }
      }
    }

    onMounted(async () => {
      await dietStore.fetchDiets(userStore.user._id)
      // Remove the manual selection - let DietSelector handle it
    })

    return {
      showCreateForm,
      selectedDiet, // This is now reactive!
      newDiet,
      error,
      diets,
      totalPercentage,
      isValid,
      calculateMacroGrams,
      calculateMacroCalories,
      calculateMacroPercentage,
      capitalizeFirst,
      closeCreateForm,
      createDiet,
      selectDiet,
      editDiet,
      updateDiet,
      deleteDiet
    }
  }
}
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