<template>
  <div class="fixed inset-0 flex items-center justify-center z-50 p-4" style="background-color: rgba(0, 0, 0, 0.8);" @click.self="$emit('close')">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h2 class="font-bold text-gray-800 text-2xl">{{ recipe.name }}</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Description -->
        <div class="mb-6">
          <p class="text-gray-700 text-lg">{{ recipe.description }}</p>
        </div>

        <!-- Metadata -->
        <div class="flex gap-4 mb-6 text-sm text-gray-500">
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ formatDate(recipe.createdAt) }}
          </span>
          <span
            v-if="recipe.recipeRating"
            class="text-xs font-bold px-2 py-1 rounded ml-2"
            :class="getGradeClass(recipe.recipeRating.overallRating)"
          > 
          AI Grade: {{recipe.recipeRating.overallRating}}
          </span>
          <span
            v-else
            class="text-xs font-bold px-2 py-1 rounded ml-2"
            :class="getGradeClass(recipe.grade)"
          >
            Grade {{ recipe.grade }}
          </span>
        </div>

        <!-- Recipe Rating Button (only if recipeRating exists) -->
        <div v-if="recipe.recipeRating" class="mb-6">
          <RecipeRating
            button-text="View Detailed AI Analysis"
            :recipe-rating="recipe.recipeRating"
          />
        </div>

        <!-- Ingredients -->
        <div class="mb-6">
          <h3 class="font-semibold text-gray-800 text-lg mb-3 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Ingredients
          </h3>
          <div v-if="recipe.ingredients && recipe.ingredients.length > 0" class="space-y-3">
            <div
              v-for="foodItem in recipe.ingredients"
              :key="foodItem._id || foodItem.name"
              class="bg-gray-50 rounded-lg p-3 border border-gray-200"
            >
              <div class="flex justify-between items-start">
                <strong class="text-gray-800">{{ foodItem.name }}</strong>
                <span class="text-blue-600 font-medium">{{ foodItem.quantity }}</span>
              </div>
              <div v-if="foodItem.allergens?.length > 0" class="mt-2 flex flex-wrap gap-1">
                <span
                  v-for="allergen in foodItem.allergens"
                  :key="allergen"
                  class="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full"
                >
                  {{ allergen }}
                </span>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-500 text-sm">No ingredients listed</p>
        </div>

        <!-- Macros/Nutrients -->
        <div v-if="recipe.macros && recipe.macros.length > 0">
          <h3 class="font-semibold text-gray-800 text-lg mb-3 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Nutrition Facts
          </h3>
          
          <!-- Total Calories Highlight -->
          <div class="bg-blue-50 border-2 border-blue-400 rounded-lg p-4 mb-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-700 font-semibold">Total Calories</span>
              <span class="text-2xl font-bold text-blue-600">{{ recipe.totalCalories }} kcal</span>
            </div>
          </div>

          <!-- Macro Grid -->
          <div class="grid grid-cols-2 gap-3">
            <div
              v-for="nutrient in recipe.macros"
              :key="nutrient._id"
              class="bg-gray-50 rounded-lg p-3 border border-gray-200"
            >
              <div class="text-sm text-gray-600">{{ nutrient.name }}</div>
              <div class="text-lg font-semibold text-gray-800">
                {{ nutrient.totalAmount }} <span class="text-sm font-normal text-gray-500">{{ nutrient.unit }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getGradeClass } from '@/utils/gradeUtils';
import RecipeRating from './RecipeRating.vue';

export default {
  name: 'RecipeDetail',
  components: {
    RecipeRating,
  },
  props: {
    recipe: {
      type: Object,
      required: true,
    },
  },
  emits: ['close'],
  setup() {
    return { getGradeClass };
  },
  methods: {
    formatDate(date) {
      if (!date) return '-';
      const d = new Date(date);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
    },
    handleRatingLoaded(rating) {
      console.log('Rating loaded:', rating);
    },
    handleRatingError(error) {
      console.error('Rating error:', error);
    },
  },
};
</script>