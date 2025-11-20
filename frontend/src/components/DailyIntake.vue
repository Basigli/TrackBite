<template>
  <div class="daily-intake mt-4">
    <h2 class="text-xl font-semibold mb-2">Today's Meals</h2>
    <Meal v-for="meal in meals" :key="meal.id" :meal="meal"/>
    <Recipe v-for="recipe in recipes" :key="recipe.id" :recipe="recipe"/>
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
