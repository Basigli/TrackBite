<template>
  <div class="scanned-item bg-white rounded-xl shadow-sm p-4 mb-4 max-w-md mx-auto">
    <h3 class="font-bold text-gray-800 text-lg mb-3">Scanned Item</h3>
    
    <div class="flex justify-between items-center mb-3">
      <div>
        <span class="text-gray-700 font-medium block">{{ item.name }}</span>
        <span class="text-sm text-gray-500">{{ item.quantity }}{{ item.quantityUnit }}</span>
      </div>
      <button
        @click="showModal = true"
        class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors font-medium shadow-sm"
      >
        Add
      </button>
    </div>

    <!-- Modal Overlay -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      @click.self="closeModal"
    >
      <!-- Modal Content -->
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <!-- Modal Header -->
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-800">Add Food Item</h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Food Item Info -->
        <div class="mb-6">
          <h3 class="font-semibold text-gray-700 mb-2">{{ item.name }}</h3>
          <div class="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div>
              <span class="font-medium">Total:</span> {{ item.quantity }}{{ item.quantityUnit }}
            </div>
            <div>
              <span class="font-medium">Per Serving:</span> {{ item.quantityPerServing }}{{ item.quantityUnit }}
            </div>
            <div>
              <span class="font-medium">Grade:</span> 
              <span :class="getGradeColor(item.grade)" class="font-bold">{{ item.grade }}</span>
            </div>
            <div>
              <span class="font-medium">Score:</span> {{ item.score }}
            </div>
          </div>
        </div>

        <!-- Conversion Options -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Choose conversion method:
          </label>

          <!-- Toggle Buttons -->
          <div class="flex gap-2 mb-4">
            <button
              @click="conversionType = 'servings'"
              class="flex-1 py-2 px-4 rounded-md font-medium transition-colors"
              :class="conversionType === 'servings' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            >
              By Servings
            </button>
            <button
              @click="conversionType = 'grams'"
              class="flex-1 py-2 px-4 rounded-md font-medium transition-colors"
              :class="conversionType === 'grams' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            >
              By Grams
            </button>
            <button
              @click="conversionType = 'default'"
              class="flex-1 py-2 px-4 rounded-md font-medium transition-colors"
              :class="conversionType === 'default' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            >
              Full Package
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
            <p class="text-sm text-gray-500">
              Total servings in package: {{ totalServings.toFixed(1) }}
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
            <p class="text-sm text-gray-500">
              Total in package: {{ item.quantity }}g
            </p>
          </div>

          <!-- Default Message -->
          <div v-if="conversionType === 'default'" class="text-sm text-gray-600">
            <p>Add the entire package with all nutritional values.</p>
          </div>
        </div>

        <!-- Preview Section -->
        <div v-if="preview" class="mb-6 bg-gray-50 rounded-lg p-4">
          <h4 class="font-semibold text-gray-700 mb-2">Preview:</h4>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Quantity:</span>
              <span class="font-medium">{{ preview.quantity }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Calories:</span>
              <span class="font-medium">{{ preview.calories.toFixed(0) }} kcal</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Percentage:</span>
              <span class="font-medium">{{ percentage.toFixed(1) }}%</span>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>

        <!-- Modal Actions -->
        <div class="flex gap-3">
          <button
            @click="closeModal"
            class="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            @click="handleAdd"
            :disabled="!isValid"
            class="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add to Diary
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { FoodItemConverter } from '../utlis/FoodItemConverter'

export default {
  name: 'ScannedItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  emits: ['add'],
  setup(props, { emit }) {
    const showModal = ref(false)
    const conversionType = ref('default') // 'servings', 'grams', or 'default'
    const servings = ref(1)
    const grams = ref(100)
    const error = ref('')

    const converter = new FoodItemConverter()

    // Calculate total servings in the package
    const totalServings = computed(() => {
      return props.item.quantity / props.item.quantityPerServing
    })

    // Calculate percentage for preview
    const percentage = computed(() => {
      if (conversionType.value === 'servings') {
        return (servings.value / totalServings.value) * 100
      } else if (conversionType.value === 'grams') {
        return (grams.value / props.item.quantity) * 100
      }
      return 100
    })

    // Validate input
    const isValid = computed(() => {
      if (conversionType.value === 'servings') {
        return servings.value > 0 && servings.value <= totalServings.value
      } else if (conversionType.value === 'grams') {
        return grams.value > 0 && grams.value <= props.item.quantity
      }
      return true // default is always valid
    })

    // Generate preview
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

    // Reset validation error when inputs change
    watch([conversionType, servings, grams], () => {
      error.value = ''
    })

    const closeModal = () => {
      showModal.value = false
      error.value = ''
      // Reset to defaults
      conversionType.value = 'default'
      servings.value = 1
      grams.value = 100
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

        // Emit the converted food item
        emit('add', foodItem)
        
        // Close modal
        closeModal()
      } catch (err) {
        console.error('Conversion error:', err)
        error.value = 'Failed to convert item. Please try again.'
      }
    }

    const getGradeColor = (grade) => {
      const colors = {
        'a': 'text-green-600',
        'b': 'text-lime-600',
        'c': 'text-yellow-600',
        'd': 'text-orange-600',
        'e': 'text-red-600'
      }
      return colors[grade.toLowerCase()] || 'text-gray-600'
    }

    return {
      showModal,
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
      getGradeColor
    }
  }
}
</script>

<style scoped>
/* Modal animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>