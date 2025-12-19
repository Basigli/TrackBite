<template>
  <div>
    <!-- Trigger Button -->
    <button
      @click="openModal"
      class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors font-medium shadow-sm flex items-center gap-2"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
      {{ buttonText }}
    </button>

    <!-- Modal Overlay -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      @click.self="closeModal"
    >
      <!-- Modal Content -->
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <!-- Modal Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
          <h2 class="text-2xl font-bold text-gray-800">AI Health Rating Analysis</h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 text-3xl leading-none"
          >
            ×
          </button>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <div v-if="recipeRating">
            <!-- Overall Rating -->
            <div class="mb-8">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-semibold text-gray-700">Overall Rating</h3>
                <div 
                  class="text-4xl font-bold px-6 py-3 rounded-lg"
                  :class="getRatingColor(recipeRating.overallRating)"
                >
                  {{ recipeRating.overallRating }}
                </div>
              </div>
              <div class="flex items-center mb-4">
                <span class="text-lg font-semibold text-gray-700 mr-3">Total Score:</span>
                <span class="text-2xl font-bold text-blue-600">{{ recipeRating.score }}/100</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  class="h-4 rounded-full transition-all duration-700"
                  :class="getScoreColor(recipeRating.score)"
                  :style="{ width: recipeRating.score + '%' }"
                ></div>
              </div>
            </div>

            <!-- Reasoning -->
            <div class="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h4 class="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Reasoning
              </h4>
              <p class="text-gray-700">{{ recipeRating.reasoning }}</p>
            </div>

            <!-- Health Impact -->
            <div class="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <h4 class="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Health Impact
              </h4>
              <p class="text-gray-700">{{ recipeRating.healthImpact }}</p>
            </div>

            <!-- Individual Scores -->
            <div class="space-y-6 mb-6">
              <!-- Ingredients Score -->
              <div 
                class="border rounded-lg p-5"
                :class="getRatingBorderColor(recipeRating.overallRating)"
              >
                <div class="flex justify-between items-center mb-3">
                  <h4 class="font-semibold text-gray-800">Ingredients Quality</h4>
                  <span class="text-lg font-bold text-gray-700">
                    {{ recipeRating.ingredientsScore }}/100
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div
                    class="h-3 rounded-full transition-all duration-700"
                    :class="getScoreColor(recipeRating.ingredientsScore)"
                    :style="{ width: recipeRating.ingredientsScore + '%' }"
                  ></div>
                </div>
              </div>

              <!-- Cooking Method Score -->
              <div 
                class="border rounded-lg p-5"
                :class="getRatingBorderColor(recipeRating.overallRating)"
              >
                <div class="flex justify-between items-center mb-3">
                  <h4 class="font-semibold text-gray-800">Cooking Method</h4>
                  <span class="text-lg font-bold text-gray-700">
                    {{ recipeRating.cookingMethodScore }}/100
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div
                    class="h-3 rounded-full transition-all duration-700"
                    :class="getScoreColor(recipeRating.cookingMethodScore)"
                    :style="{ width: recipeRating.cookingMethodScore + '%' }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Recommendations -->
            <div v-if="recipeRating.recommendations && recipeRating.recommendations.length > 0" class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <h4 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Recommendations
              </h4>
              <ul class="space-y-2">
                <li 
                  v-for="(recommendation, index) in recipeRating.recommendations" 
                  :key="index"
                  class="flex items-start gap-2 text-gray-700"
                >
                  <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                  <span>{{ recommendation }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div v-else class="text-center text-gray-500 py-8">
            No rating data available
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="border-t border-gray-200 p-6 bg-gray-50 rounded-b-xl flex-shrink-0">
          <button
            @click="closeModal"
            class="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'RecipeRating',
  props: {
    buttonText: {
      type: String,
      default: 'View Health Rating'
    },
    recipeRating: {
      type: Object,
      required: true,
      default: null
    }
  },
  setup() {
    const showModal = ref(false)

    const openModal = () => {
      showModal.value = true
    }

    const closeModal = () => {
      showModal.value = false
    }

    const getRatingColor = (grade) => {
      const colors = {
        'A': 'text-green-600 bg-green-100 border-2 border-green-500',
        'B': 'text-lime-600 bg-lime-100 border-2 border-lime-500',
        'C': 'text-yellow-600 bg-yellow-100 border-2 border-yellow-500',
        'D': 'text-orange-600 bg-orange-100 border-2 border-orange-500',
        'E': 'text-red-600 bg-red-100 border-2 border-red-500',
      }
      return colors[grade] || 'text-gray-600 bg-gray-100'
    }

    const getRatingBorderColor = (grade) => {
      const colors = {
        'A': 'border-green-300',
        'B': 'border-lime-300',
        'C': 'border-yellow-300',
        'D': 'border-orange-300',
        'E': 'border-red-300',
      }
      return colors[grade] || 'border-gray-300'
    }

    const getScoreColor = (score) => {
      if (score >= 80) return 'bg-green-500'
      if (score >= 60) return 'bg-lime-500'
      if (score >= 40) return 'bg-yellow-500'
      if (score >= 20) return 'bg-orange-500'
      return 'bg-red-500'
    }

    return {
      showModal,
      openModal,
      closeModal,
      getRatingColor,
      getRatingBorderColor,
      getScoreColor
    }
  }
}
</script>

<style scoped>
@keyframes slideIn {
  from {
    width: 0;
  }
}

.bg-green-500,
.bg-lime-500,
.bg-yellow-500,
.bg-orange-500,
.bg-red-500 {
  animation: slideIn 0.7s ease-out;
}
</style>