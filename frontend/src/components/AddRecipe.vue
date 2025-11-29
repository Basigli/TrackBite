<template>
  <div class="add-recipe mb-6 p-6 rounded-xl bg-white shadow-md max-w-md mx-auto">
    <h2 class="text-xl font-bold mb-4 text-gray-800">Add New Recipe</h2>
    <form @submit.prevent="submitRecipe" class="flex flex-col gap-4">
      <input
        v-model="name"
        type="text"
        placeholder="Recipe name"
        required
        class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
      />

      <input
        v-model.number="servings"
        type="number"
        placeholder="Servings"
        min="1"
        required
        class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
      />

      <textarea
        v-model="ingredientsText"
        placeholder="Ingredients (name, quantity g per line)"
        class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition resize-none h-32"
      ></textarea>

      <button
        type="submit"
        class="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg px-4 py-2 transition shadow-md hover:shadow-lg"
      >
        Add Recipe
      </button>
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
