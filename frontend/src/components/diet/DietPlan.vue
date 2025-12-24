<template>
  <div class="diet-plan bg-white rounded-xl shadow-md p-5 mb-4">
    <div class="flex justify-between items-center mb-3">
      <h2 class="text-xl font-bold text-gray-800">{{ diet.name }}</h2>

      <div class="flex gap-3">
        <button
          @click="editMode = !editMode"
          class="text-blue-500 hover:text-blue-700 font-medium transition-colors"
        >
          {{ editMode ? 'Cancel' : 'Edit' }}
        </button>

        <button
          @click="$emit('delete-diet', diet._id)"
          class="text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          Delete
        </button>
      </div>
    </div>

    <!-- EDIT MODE -->
    <div v-if="editMode" class="flex flex-col gap-3">
      <input
        v-model="dietName"
        type="text"
        class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
        placeholder="Diet name"
      />

      <input
        v-model.number="dietCalories"
        type="number"
        class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
        placeholder="Calories amount"
      />

      <button
        @click="saveDiet"
        class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors font-medium"
      >
        Save
      </button>
    </div>

    <!-- VIEW MODE -->
    <div v-else>
      <p class="text-gray-700">
        <span class="font-semibold">Calories:</span>
        {{ diet.caloriesAmount }} kcal
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  diet: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update-diet', 'delete-diet'])

const editMode = ref(false)
const dietName = ref(props.diet.name)
const dietCalories = ref(props.diet.caloriesAmount)

watch(
  () => props.diet,
  (newDiet) => {
    dietName.value = newDiet.name
    dietCalories.value = newDiet.caloriesAmount
  }
)

const saveDiet = () => {
  emit('update-diet', props.diet._id, {
    name: dietName.value,
    caloriesAmount: dietCalories.value
  })
  editMode.value = false
}
</script>