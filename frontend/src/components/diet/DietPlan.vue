<template>
  <div class="diet-plan bg-white rounded-xl shadow-md p-5 mb-4">
    <div class="flex justify-between items-center mb-3">
      <h2 class="text-xl font-bold text-gray-800">{{ diet.name }}</h2>

      <div class="flex gap-3">
        <button
          @click="showEditModal = true"
          class="text-blue-500 hover:text-blue-700 font-medium transition-colors"
        >
          Edit
        </button>

        <button
          @click="$emit('delete-diet', diet._id)"
          class="text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          Delete
        </button>
      </div>
    </div>

    <!-- VIEW MODE -->
    <div>
      <p class="text-gray-700">
        <span class="font-semibold">Calories:</span>
        {{ diet.caloriesAmount }} kcal
      </p>
      
      <!-- Macros Display -->
      <div v-if="diet.macros && diet.macros.length > 0" class="mt-3 grid grid-cols-3 gap-2">
        <div 
          v-for="macro in diet.macros" 
          :key="`${diet._id}-${macro.name}`"
          class="bg-gray-50 rounded p-2 text-center"
        >
          <div class="text-xs text-gray-500">{{ capitalizeFirst(macro.name) }}</div>
          <div class="font-semibold text-gray-800">{{ macro.totalAmount.toFixed(1) }}g</div>
        </div>
      </div>
    </div>

    <!-- Edit Diet Modal (stesso modale usato per create) -->
    <CreateDietModal
      :show="showEditModal"
      :userId="userId"
      :diet="diet"
      @close="showEditModal = false"
      @update="handleUpdateDiet"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CreateDietModal from './CreateDietModal.vue'

const props = defineProps({
  diet: {
    type: Object,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update-diet', 'delete-diet'])

const showEditModal = ref(false)

const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const handleUpdateDiet = (dietId, updatedDietData) => {
  console.log('DietPlan - handleUpdateDiet:', dietId, updatedDietData)
  emit('update-diet', dietId, updatedDietData)
  showEditModal.value = false
}
</script>