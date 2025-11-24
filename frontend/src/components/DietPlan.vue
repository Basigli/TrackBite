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
          @click="$emit('delete-diet', diet.id)"
          class="text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          Delete
        </button>
      </div>
    </div>

    <div v-if="editMode" class="flex flex-col gap-3">
      <input
        v-model="dietName"
        type="text"
        class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
        placeholder="Diet name"
      />
      <textarea
        v-model="dietDescription"
        class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
        placeholder="Diet description"
      ></textarea>
      <button
        @click="saveDiet"
        class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors font-medium"
      >
        Save
      </button>
    </div>

    <div v-else>
      <p class="text-gray-700">{{ diet.description }}</p>
      <ul class="mt-3 space-y-1 text-gray-600">
        <li v-for="(meal, index) in diet.meals" :key="index">
          <span class="font-medium">{{ meal.name }}:</span> {{ meal.calories }} kcal
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'DietPlan',
  props: { diet: Object },
  emits: ['update-diet', 'delete-diet'],
  setup(props, { emit }) {
    const editMode = ref(false);
    const dietName = ref(props.diet.name);
    const dietDescription = ref(props.diet.description || '');

    watch(() => props.diet, (newDiet) => {
      dietName.value = newDiet.name;
      dietDescription.value = newDiet.description || '';
    });

    const saveDiet = () => {
      emit('update-diet', props.diet.id, { name: dietName.value, description: dietDescription.value });
      editMode.value = false;
    };

    return { editMode, dietName, dietDescription, saveDiet };
  }
};
</script>
