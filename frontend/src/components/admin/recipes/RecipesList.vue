<template>
  <div class="space-y-3">
    <RecipeCard
      v-for="recipe in recipes"
      :key="recipe._id"
      :recipe="recipe"
      :users="users"
      @view-details="$emit('view-details', recipe)"
      @confirm-delete="$emit('confirm-delete', recipe)"
    />
  </div>
</template>

<script>
import RecipeCard from './RecipeCard.vue';

export default {
  name: 'RecipesList',
  components: { RecipeCard },
  props: {
    recipes: { type: Array, required: true },
    users: { type: Object, required: true }
  },
  emits: ['view-details', 'confirm-delete']
};
</script>
