<script setup>
import { ref, watch, reactive } from 'vue';
import Recipe from './Recipe.vue';

const props = defineProps({
  recipes: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['delete-recipe', 'save-recipe']);

const editableRecipes = ref([]);

const newIngredient = reactive({
  name: '',
  percentage: null,
  allergens: '',
});

// Watch for changes in recipes prop
watch(
  () => props.recipes,
  (list) => {
    editableRecipes.value = list.map((r) => ({
      ...r,
      isEditing: false,
      edit: { 
        ...r,
        // Ensure ingredients array exists and is properly structured
        ingredients: Array.isArray(r.ingredients) 
          ? r.ingredients.map(ing => ({
              ...ing,
              scannedItem: ing.scannedItem || { name: ing.name || 'Unknown', allergens: [] }
            }))
          : [],
      },
    }));
  },
  { immediate: true }
);

const startEdit = (recipe) => {
  recipe.isEditing = true;
  // Reset new ingredient form
  newIngredient.name = '';
  newIngredient.percentage = null;
  newIngredient.allergens = '';
};

const cancelEdit = (recipe) => {
  recipe.edit = { 
    ...recipe,
    ingredients: Array.isArray(recipe.ingredients)
      ? recipe.ingredients.map(ing => ({
          ...ing,
          scannedItem: ing.scannedItem || { name: ing.name || 'Unknown', allergens: [] }
        }))
      : [],
  };
  recipe.isEditing = false;
};

const addIngredient = (recipe) => {
  if (!newIngredient.name || newIngredient.percentage === null) {
    alert('Please enter ingredient name and percentage');
    return;
  }

  const ingredient = {
    _id: Date.now().toString(),
    percentage: newIngredient.percentage,
    scannedItem: {
      name: newIngredient.name,
      allergens: newIngredient.allergens 
        ? newIngredient.allergens.split(',').map(a => a.trim()).filter(Boolean)
        : [],
    },
  };

  recipe.edit.ingredients.push(ingredient);

  // Reset form
  newIngredient.name = '';
  newIngredient.percentage = null;
  newIngredient.allergens = '';
};

const removeIngredient = (recipe, index) => {
  recipe.edit.ingredients.splice(index, 1);
};

const saveEdit = (recipe) => {
  emit('save-recipe', recipe._id, { ...recipe.edit });
  recipe.isEditing = false;
};
</script>