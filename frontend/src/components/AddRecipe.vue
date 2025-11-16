<template>
  <div class="add-recipe mb-4 border p-3 rounded bg-gray-50">
    <h2 class="font-semibold mb-2">Add New Recipe</h2>
    <form @submit.prevent="submitRecipe" class="flex flex-col gap-2">
      <input v-model="name" type="text" placeholder="Recipe name" required class="border px-2 py-1 rounded"/>
      <input v-model.number="servings" type="number" placeholder="Servings" min="1" required class="border px-2 py-1 rounded"/>
      <textarea v-model="ingredientsText" placeholder="Ingredients (name, quantity g per line)" class="border px-2 py-1 rounded"></textarea>
      <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded mt-2">Add Recipe</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRecipeStore } from '../store/recipeStore';

export default {
  name: 'AddRecipe',
  emits: ['recipe-added'],
  setup(_, { emit }) {
    const store = useRecipeStore();
    const name = ref('');
    const servings = ref(1);
    const ingredientsText = ref('');

    const parseIngredients = () => {
      return ingredientsText.value.split('\n').map((line, index) => {
        const [ingName, qty] = line.split(',').map(s => s.trim());
        return { id: index, name: ingName, quantity: Number(qty) };
      });
    };

    const submitRecipe = async () => {
      if (!name.value) return;
      const recipe = {
        name: name.value,
        servings: servings.value,
        ingredients: parseIngredients(),
      };
      await store.addRecipe(recipe);
      emit('recipe-added');
      name.value = '';
      servings.value = 1;
      ingredientsText.value = '';
    };

    return { name, servings, ingredientsText, submitRecipe };
  }
};
</script>
