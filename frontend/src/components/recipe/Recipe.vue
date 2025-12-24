<template>
  <div class="recipe">
    <!-- Recipe Name with Grade -->
    <div class="flex items-center justify-between mb-2">
      <h2 class="font-bold text-gray-800 text-xl">{{ recipe.name }}</h2>
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

    <!-- Recipe Description (truncated) -->
    <p class="text-gray-700 mb-2 line-clamp-2">{{ recipe.description }}</p>

    <!-- Quick Stats -->
    <div class="flex gap-4 text-sm text-gray-500 mb-3">
      <span class="flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ recipe.totalCalories }} kcal
      </span>
      <span class="flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        {{ recipe.ingredients?.length || 0 }} ingredients
      </span>
    </div>

    <!-- View Details Button -->
    <button
      @click="showDetails = true"
      class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm px-4 py-2 rounded transition"
    >
      View Details
    </button>

    <!-- Detail Modal -->
    <RecipeDetail
      v-if="showDetails"
      :recipe="recipe"
      @close="showDetails = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RecipeDetail from './RecipeDetail.vue'
import { getGradeClass } from '@/utils/gradeUtils'

defineProps({
  recipe: {
    type: Object,
    required: true
  }
})

const showDetails = ref(false)
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>