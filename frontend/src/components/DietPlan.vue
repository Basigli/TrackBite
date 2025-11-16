<template>
  <div class="diet-plan border p-4 rounded bg-gray-50">
    <div class="flex justify-between mb-2">
      <h2 class="font-semibold text-xl">{{ diet.name }}</h2>
      <div class="flex gap-2">
        <button @click="editMode = !editMode" class="text-blue-500 hover:underline">{{ editMode ? 'Cancel' : 'Edit' }}</button>
        <button @click="$emit('delete-diet', diet.id)" class="text-red-500 hover:underline">Delete</button>
      </div>
    </div>

    <div v-if="editMode" class="flex flex-col gap-2">
      <input v-model="dietName" type="text" class="border px-2 py-1 rounded"/>
      <textarea v-model="dietDescription" class="border px-2 py-1 rounded" placeholder="Diet description"></textarea>
      <button @click="saveDiet" class="bg-green-500 text-white px-3 py-1 rounded">Save</button>
    </div>

    <div v-else>
      <p>{{ diet.description }}</p>
      <ul class="mt-2">
        <li v-for="(meal, index) in diet.meals" :key="index">{{ meal.name }}: {{ meal.calories }} kcal</li>
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
