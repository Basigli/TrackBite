<template>
  <div class="diet-page p-4">
    <h1 class="text-2xl font-bold mb-4">Diet Plans</h1>

    <!-- Diet selector -->
    <DietSelector :diets="diets" :selectedDiet="selectedDiet" @select-diet="selectDiet" />

    <!-- Show selected diet -->
    <DietPlan v-if="selectedDiet" :diet="selectedDiet" @update-diet="updateDiet" @delete-diet="deleteDiet" />
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
