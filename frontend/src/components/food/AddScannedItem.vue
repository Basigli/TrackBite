<template>
  <!-- Modal Overlay -->
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    @click.self="closeModal"
  >
    <!-- Modal Content -->
    <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Add Food Item</h2>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Left Column - Product Info -->
        <div class="space-y-4">
          <!-- Product Header -->
          <div class="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
            <h3 class="font-bold text-gray-800 text-lg mb-2">{{ item.name }}</h3>
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm text-gray-600">Barcode: {{ item.barcode }}</span>
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500">Grade:</span>
                <span :class="getGradeColor(item.grade)" class="text-2xl font-bold">
                  {{ item.grade.toUpperCase() }}
                </span>
              </div>
            </div>
            <div class="text-sm text-gray-600">
              Score: <span class="font-semibold">{{ item.score }}/100</span>
            </div>
          </div>

          <!-- Package Info -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-semibold text-gray-700 mb-3 text-sm">Package Information</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Total:</span>
                <span class="font-medium">{{ item.quantity }}{{ item.quantityUnit }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Per Serving:</span>
                <span class="font-medium">{{ item.quantityPerServing }}{{ item.quantityUnit }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Total Servings:</span>
                <span class="font-medium">{{ totalServings.toFixed(1) }}</span>
              </div>
            </div>
          </div>

          <!-- Macros -->
          <div v-if="preview.macros.length > 0" class="bg-white border border-gray-200 rounded-lg p-4">
            <h4 class="font-semibold text-gray-700 mb-3 text-sm">Macronutrients</h4>
            <div class="grid grid-cols-3 gap-2">
              <div 
                v-for="macro in preview.macros" 
                :key="macro.name"
                class="rounded-lg p-3 text-center"
                :class="MACRO_COLORS[getKeyFromMacro[macro.name]].light"
              >
                <div class="text-xs text-gray-600 mb-1">{{ macro.name }}</div>
                <div class="font-bold text-green-700 text-sm">{{ macro.totalAmount }}{{ macro.unit }}</div>
              </div>
            </div>
          </div>

          <!-- Nutrients -->
          <div v-if="preview.nutrients.length > 0" class="bg-white border border-gray-200 rounded-lg p-4">
            <h4 class="font-semibold text-gray-700 mb-3 text-sm">Nutrients</h4>
            <div class="grid grid-cols-3 gap-2">
              <div 
                v-for="nutrient in preview.nutrients" 
                :key="nutrient.name"
                class="bg-green-50 rounded-lg p-3 text-center"
              >
                <div class="text-xs text-gray-600 mb-1">{{ nutrient.name }}</div>
                <div class="font-bold text-green-700 text-sm">{{ nutrient.totalAmount }}{{ nutrient.unit }}</div>
              </div>
            </div>
          </div>

          <!-- Nutrient Levels -->
          <div v-if="Object.keys(preview.nutrientLevels).length > 0" class="bg-white border border-gray-200 rounded-lg p-4">
            <h4 class="font-semibold text-gray-700 mb-3 text-sm">Nutrient Levels</h4>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="(value, name) in preview.nutrientLevels" 
                :key="name"
                :class="getNutrientLevelColor(value)"
                class="px-3 py-1 rounded-full text-xs font-medium"
              >
                {{ name }}: {{ value }}
              </span>
            </div>
          </div>

          <!-- Allergens -->
          <div v-if="item.allergens && item.allergens.length > 0" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 class="font-semibold text-red-800 mb-3 text-sm flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              Allergens Warning
            </h4>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="allergen in item.allergens" 
                :key="allergen"
                class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium border border-red-300"
              >
                {{ allergen }}
              </span>
            </div>
          </div>

          <!-- Ingredients -->
          <div v-if="item.ingredients && item.ingredients.length > 0" class="bg-white border border-gray-200 rounded-lg p-4">
            <h4 class="font-semibold text-gray-700 mb-2 text-sm">Ingredients</h4>
            <p class="text-xs text-gray-600 leading-relaxed">
              {{ item.ingredients.join(', ') }}
            </p>
          </div>
        </div>

        <!-- Right Column - Conversion & Preview -->
        <div class="space-y-4">
          <!-- Conversion Options -->
          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <label class="block text-sm font-semibold text-gray-700 mb-3">
              How much do you want to add?
            </label>

            <!-- Toggle Buttons -->
            <div class="grid grid-cols-3 gap-2 mb-4">
              <button
                @click="conversionType = 'servings'"
                class="py-2 px-3 rounded-md font-medium transition-colors text-sm"
                :class="conversionType === 'servings' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
              >
                Servings
              </button>
              <button
                @click="conversionType = 'grams'"
                class="py-2 px-3 rounded-md font-medium transition-colors text-sm"
                :class="conversionType === 'grams' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
              >
                Grams
              </button>
              <button
                @click="conversionType = 'default'"
                class="py-2 px-3 rounded-md font-medium transition-colors text-sm"
                :class="conversionType === 'default' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
              >
                Full
              </button>
            </div>

            <!-- Servings Input -->
            <div v-if="conversionType === 'servings'" class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Number of servings:
              </label>
              <input
                v-model.number="servings"
                type="number"
                min="0.1"
                step="0.5"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., 1.5"
              />
              <p class="text-xs text-gray-500">
                Available: {{ totalServings.toFixed(1) }} servings
              </p>
            </div>

            <!-- Grams Input -->
            <div v-if="conversionType === 'grams'" class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Amount in grams:
              </label>
              <input
                v-model.number="grams"
                type="number"
                min="1"
                step="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., 150"
              />
              <p class="text-xs text-gray-500">
                Available: {{ item.quantity }}{{ item.quantityUnit }}
              </p>
            </div>

            <!-- Default Message -->
            <div v-if="conversionType === 'default'" class="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p class="text-sm text-blue-800">
                Adding the entire package
              </p>
            </div>
          </div>

          <!-- Preview Section -->
          <div v-if="preview" class="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 border-2 border-green-300">
            <h4 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              You're Adding
            </h4>
            <div class="space-y-3">
              <!-- Grams and Calories on same line -->
              <div class="bg-white rounded-lg p-4 shadow-sm">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-xs text-gray-500 block mb-1">Quantity</span>
                    <span class="font-bold text-gray-800 text-lg">{{ preview.quantity }}</span>
                  </div>
                  <div class="text-right">
                    <span class="text-xs text-gray-500 block mb-1">Calories</span>
                    <div>
                      <span class="font-bold text-green-600 text-2xl">{{ preview.calories.toFixed(0) }}</span>
                      <span class="text-sm text-gray-600 ml-1">kcal</span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Percentage -->
              <div class="bg-white rounded-lg p-3 shadow-sm">
                <span class="text-xs text-gray-500 block mb-1">Percentage of package</span>
                <span class="font-bold text-blue-600 text-lg">{{ percentage.toFixed(1) }}%</span>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
            <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm">{{ error }}</span>
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
              @click="handleAdd"
              :disabled="!isValid"
              class="flex-1 bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
            >
              Add Food
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { FoodItemConverter } from '../../utils/FoodItemConverter'
import { getGradeColor, getNutrientLevelColor } from '../../constants/theme'
import { MACRO_COLORS, getKeyFromMacro } from '../../constants/theme'

export default {
  name: 'AddScannedItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'add'],
  setup(props, { emit }) {
    const conversionType = ref('default')
    const servings = ref(1)
    const grams = ref(100)
    const error = ref('')

    const converter = new FoodItemConverter()

    const totalServings = computed(() => {
      return props.item.quantity / props.item.quantityPerServing
    })

    const percentage = computed(() => {
      if (conversionType.value === 'servings') {
        return (servings.value / totalServings.value) * 100
      } else if (conversionType.value === 'grams') {
        return (grams.value / props.item.quantity) * 100
      }
      return 100
    })

    const isValid = computed(() => {
      if (conversionType.value === 'servings') {
        return servings.value > 0 && servings.value <= totalServings.value
      } else if (conversionType.value === 'grams') {
        return grams.value > 0 && grams.value <= props.item.quantity
      }
      return true
    })

    const preview = computed(() => {
      if (!isValid.value) return null
      try {
        let foodItem
        if (conversionType.value === 'servings') {
          foodItem = converter.toFoodItemWithServings(props.item, servings.value)
        } else if (conversionType.value === 'grams') {
          foodItem = converter.toFoodItemWithGrams(props.item, grams.value)
        } else {
          foodItem = converter.toFoodItemDefault(props.item)
        }
        return foodItem
      } catch (err) {
        console.error('Preview error:', err)
        return null
      }
    })

    watch([conversionType, servings, grams], () => {
      error.value = ''
    })

    const closeModal = () => {
      error.value = ''
      conversionType.value = 'default'
      servings.value = 1
      grams.value = 100
      emit('close')
    }

    const handleAdd = () => {
      if (!isValid.value) {
        error.value = 'Please enter valid values'
        return
      }

      try {
        let foodItem

        if (conversionType.value === 'servings') {
          foodItem = converter.toFoodItemWithServings(props.item, servings.value)
        } else if (conversionType.value === 'grams') {
          foodItem = converter.toFoodItemWithGrams(props.item, grams.value)
        } else {
          foodItem = converter.toFoodItemDefault(props.item)
        }

        console.log(props.item)
        console.log('Adding food item:', foodItem)

        emit('add', foodItem)
        closeModal()
      } catch (err) {
        console.error('Conversion error:', err)
        error.value = 'Failed to convert item. Please try again.'
      }
    }

    return {
      conversionType,
      servings,
      grams,
      error,
      totalServings,
      percentage,
      isValid,
      preview,
      closeModal,
      handleAdd,
      getGradeColor,
      getNutrientLevelColor,
      MACRO_COLORS,
      getKeyFromMacro
    }
  }
}
</script>
