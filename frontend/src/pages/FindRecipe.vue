<template>
  <div class="community-recipes mt-4 max-w-2xl mx-auto">
    <div class="bg-white rounded-lg shadow p-4 mb-4">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">Community Recipe Feed</h2>
      <p class="text-sm text-gray-600">
        Real-time recipes from other users
        <span class="inline-flex items-center ml-2">
          <span 
            class="h-2 w-2 rounded-full mr-1"
            :class="isConnected ? 'bg-green-500' : 'bg-red-500'"
          ></span>
          {{ isConnected ? 'Connected' : 'Disconnected' }}
        </span>
      </p>
    </div>

    <!-- New Recipe Notification -->
    <transition name="slide-down">
      <div 
        v-if="showNewRecipeNotification" 
        class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <span class="text-blue-600">🎉</span>
          <span class="text-blue-800 font-medium">New recipe available!</span>
        </div>
        <button 
          @click="showNewRecipeNotification = false"
          class="text-blue-600 hover:text-blue-800"
        >
          ✕
        </button>
      </div>
    </transition>

    <div v-if="recipeStore.communityRecipes.length === 0" class="text-gray-500 text-center py-8">
      <p class="text-lg mb-2">No community recipes yet.</p>
      <p class="text-sm">Recipes from other users will appear here in real-time!</p>
    </div>

    <ul class="space-y-3">
      <transition-group name="recipe-list">
        <li
          v-for="recipe in recipeStore.communityRecipes"
          :key="recipe._id"
          class="recipe-item"
        >
          <div class="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div class="p-4">
              <!-- Recipe Header with Author Info -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <div class="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {{ getInitials(recipe.authorName || 'Unknown') }}
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">
                      {{ recipe.authorName || 'Anonymous User' }}
                    </p>
                    <p class="text-xs text-gray-400">
                      {{ formatTime(recipe.createdAt) }}
                    </p>
                  </div>
                </div>
                <span 
                  v-if="recipeStore.isRecipeNew(recipe)"
                  class="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded"
                >
                  NEW
                </span>
              </div>

              <!-- Recipe Component -->
              <Recipe :recipe="recipe" />

              <!-- Actions -->
              <div class="flex gap-2 mt-3">
                <button
                  @click="addRecipeToDailyIntake(recipe)"
                  class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm px-4 py-2 rounded transition"
                >
                  Add to My Daily Intake
                </button>
                <button
                  @click="saveToMyRecipes(recipe)"
                  class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm px-4 py-2 rounded transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </li>
      </transition-group>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { io, Socket } from 'socket.io-client';
import { useIntakeStore } from '../store/intakeStore';
import { useUserStore } from '../store/userStore';
import { useRecipeStore } from '../store/recipeStore';
import Recipe from '../components/Recipe.vue';

const intakeStore = useIntakeStore();
const userStore = useUserStore();
const recipeStore = useRecipeStore();

const isConnected = ref(false);
const showNewRecipeNotification = ref(false);
let socket: Socket | null = null;

// Connect to Socket.IO server
onMounted(() => {
  socket = io('http://localhost:3001', {
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('Connected to recipe feed');
    isConnected.value = true;
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from recipe feed');
    isConnected.value = false;
  });

  // Listen for new recipes
  socket.on('recipe:new', (recipe: any) => {
    console.log('New recipe received:', recipe);
    
    // Add to store (which persists across navigation)
    recipeStore.addCommunityRecipe(recipe);
    
    // Show notification
    showNewRecipeNotification.value = true;
    setTimeout(() => {
      showNewRecipeNotification.value = false;
    }, 3000);
  });
});

onUnmounted(() => {
  if (socket) {
    socket.disconnect();
  }
});

// Get initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Format timestamp
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

// Add recipe to daily intake
const addRecipeToDailyIntake = async (recipe: any) => {
  if (!userStore.user?._id) {
    alert('Please log in to add to daily intake');
    return;
  }

  const date = intakeStore.selectedDate;

  try {
    for (const ingredient of recipe.ingredients) {
      await intakeStore.addToDailyIntake(userStore.user._id, ingredient, date);
    }
    alert(`Added "${recipe.name}" to your daily intake!`);
  } catch (error) {
    console.error('Error adding to daily intake:', error);
    alert('Failed to add recipe to daily intake');
  }
};

// Save recipe to user's personal collection
const saveToMyRecipes = async (recipe: any) => {
  if (!userStore.user?._id) {
    alert('Please log in to save recipes');
    return;
  }

  try {
    await recipeStore.saveCommunityRecipeToOwn(recipe);
    alert(`"${recipe.name}" saved to your recipes!`);
  } catch (error) {
    console.error('Error saving recipe:', error);
    alert('Failed to save recipe');
  }
};
</script>

<style scoped>
/* Slide down animation for notification */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

/* Recipe list animations */
.recipe-list-enter-active {
  transition: all 0.4s ease;
}

.recipe-list-leave-active {
  transition: all 0.3s ease;
  position: absolute;
}

.recipe-list-enter-from {
  transform: translateY(-30px);
  opacity: 0;
}

.recipe-list-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

.recipe-list-move {
  transition: transform 0.4s ease;
}
</style>