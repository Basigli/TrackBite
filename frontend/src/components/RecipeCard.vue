<template>
  <div class="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
    <div class="p-4">
      <!-- User Info Header (optional) -->
      <div v-if="showUserInfo" class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <div class="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
            {{ getInitials(recipe.userName || 'Unknown') }}
          </div>
          <div>
            <p class="text-xs text-gray-500">
              {{ recipe.userName || 'Anonymous User' }}
            </p>
            <p v-if="recipe.createdAt" class="text-xs text-gray-400">
              {{ formatTime(recipe.createdAt) }}
            </p>
          </div>
        </div>
        
        <!-- Optional badge slot -->
        <slot name="badge"></slot>
      </div>

      <!-- Recipe Content -->
      <Recipe :recipe="recipe" />

      <!-- Action Buttons -->
      <div class="flex gap-2 mt-3">
        <button
          @click="handleAddToDailyIntake"
          class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm px-4 py-2 rounded transition"
        >
          Add to My Daily Intake
        </button>
        
        <!-- Delete or Save button -->
        <button
          v-if="showDelete"
          @click="$emit('delete', recipe._id)"
          class="bg-red-500 hover:bg-red-600 text-white font-medium text-sm px-4 py-2 rounded transition"
        >
          Delete
        </button>
        
        <button
          v-else-if="showSave"
          @click="handleSave"
          class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm px-4 py-2 rounded transition"
          :disabled="isSaved"
          :class="{ 'opacity-50 cursor-not-allowed': isSaved }"
        >
          {{ isSaved ? 'Saved' : 'Save' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useIntakeStore } from '../store/intakeStore';
import { useUserStore } from '../store/userStore';
import Recipe from './Recipe.vue';
import type { Recipe as RecipeType } from '../models/Recipe';

interface Props {
  recipe: RecipeType;
  showUserInfo?: boolean;
  showDelete?: boolean;
  showSave?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showUserInfo: false,
  showDelete: false,
  showSave: false,
});

const emit = defineEmits<{
  delete: [recipeId: string];
  save: [recipe: RecipeType];
  addedToIntake: [recipe: RecipeType];
}>();

const intakeStore = useIntakeStore();
const userStore = useUserStore();

const isSaved = computed(() => {
  return userStore.user?.savedRecipesIds.includes(props.recipe._id) || false;
});

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatTime = (timestamp: string | Date): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
};

const handleAddToDailyIntake = async () => {
  if (!userStore.user?._id) {
    throw new Error('Please log in to add to daily intake');
  }

  const date = intakeStore.selectedDate;

  for (const ingredient of props.recipe.ingredients) {
    await intakeStore.addToDailyIntake(userStore.user._id, ingredient, date);
  }

  emit('addedToIntake', props.recipe);
};

const handleSave = () => {
  if (!isSaved.value) {
    emit('save', props.recipe);
  }
};
</script>