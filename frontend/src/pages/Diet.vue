<template>
  <div class="diet-page max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Diet Plans</h1>

    <DietSelector
      :diets="diets"
      :selectedDiet="selectedDiet"
      @select-diet="selectDiet"
      class="mb-6"
    />

    <div v-if="selectedDiet" class="space-y-4">
      <DietPlan
        :diet="selectedDiet"
        @update-diet="updateDiet"
        @delete-diet="deleteDiet"
      />
    </div>

    <!-- Empty state -->
    <div v-else class="text-gray-500 text-center py-6">
      No diet selected. Please choose a diet from above.
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useDietStore } from '../store/dietStore';
import DietPlan from '../components/DietPlan.vue';
import DietSelector from '../components/DietSelector.vue';

export default {
  name: 'Diet',
  components: { DietPlan, DietSelector },
  setup() {
    const store = useDietStore();
    const userId = 1; // replace with logged-in user

    onMounted(() => {
      store.fetchDiets(userId);
    });

    const selectDiet = (diet) => store.selectDiet(diet);
    const updateDiet = (dietId, data) => store.updateDiet(dietId, userId, data);
    const deleteDiet = (dietId) => store.deleteDiet(dietId, userId);

    return { diets: store.diets, selectedDiet: store.selectedDiet, selectDiet, updateDiet, deleteDiet };
  }
};
</script>
