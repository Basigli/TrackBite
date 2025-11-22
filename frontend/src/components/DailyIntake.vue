<template>
  <div class="daily-intake mt-6 max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Today's Meals & Recipes</h2>
    <div class="space-y-4">
      <Meal v-for="meal in meals" :key="meal.id" :meal="meal"/>
      <Recipe v-for="recipe in recipes" :key="recipe.id" :recipe="recipe"/>
    </div>
  </div>
</template>

<script>
import Meal from './Meal.vue';
import Recipe from './Recipe.vue';
import { ref, watch } from 'vue';

export default {
  name: 'DailyIntake',
  components: { Meal, Recipe },
  props: { meals: Array },
  setup(props) {
    const recipes = ref([]); // fetch recipes from API

    // Watch meals to reactively handle changes if needed
    watch(() => props.meals, (newMeals) => {
      console.log('Meals updated:', newMeals);
    });

    return { recipes };
  }
};
</script>
