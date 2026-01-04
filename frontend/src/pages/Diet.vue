<template>
  <div class="diet-page p-6 max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Diet Management</h1>

    <!-- Create New Diet Button -->
    <button
      @click="showCreateForm = true"
      class="mb-6 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold shadow-md flex items-center gap-2"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Create New Diet
    </button>

    <!-- Create Diet Modal -->
    <CreateDietModal
      :show="showCreateForm"
      :userId="userStore.user._id"
      @close="showCreateForm = false"
      @create="handleCreateDiet"
    />

    <!-- Diet Selector -->
    <DietSelector
      v-if="diets.length > 0"
      :diets="diets"
      :selectedDiet="selectedDiet"
      @select-diet="selectDiet"
      class="mb-6"
    />

    <!-- Current Selected Diet -->
    <CurrentDiet
      :selectedDiet="selectedDiet"
      @delete-diet="deleteDiet"
      class="mb-6"
    />

    <!-- All Diets List -->
    <div v-if="diets.length > 0" class="space-y-4">
      <h2 class="text-xl font-bold text-gray-800">All Your Diets</h2>
      
      <DietPlan
        v-for="diet in diets"
        :key="diet._id"
        :diet="diet"
        :userId="userStore.user._id"
        @update-diet="updateDiet"
        @delete-diet="deleteDiet"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="text-xl font-semibold text-gray-700 mb-2">No Diets Yet</h3>
      <p class="text-gray-500 mb-4">Create your first diet plan to get started!</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import DietSelector from '../components/diet/DietSelector.vue'
import DietPlan from '../components/diet/DietPlan.vue'
import CreateDietModal from '../components/diet/CreateDietModal.vue'
import CurrentDiet from '../components/diet/CurrentDiet.vue'
import { useDietStore } from '../store/dietStore'
import { useUserStore } from '../store/userStore'

export default {
  name: 'Diet',
  components: {
    DietSelector,
    DietPlan,
    CreateDietModal,
    CurrentDiet
  },
  setup() {
    const dietStore = useDietStore()
    const userStore = useUserStore()
    
    const { selectedDiet } = storeToRefs(dietStore)
    
    const showCreateForm = ref(false)
    const diets = computed(() => dietStore.diets)

    const handleCreateDiet = async (dietData) => {
      try {
        console.log("Creating diet with data:", dietData)
        await dietStore.createDiet(dietData)
        
        showCreateForm.value = false
      } catch (err) {
        console.error('Error creating diet:', err)
      }
    }

    const selectDiet = (diet) => {
      console.log('Parent - selectDiet called with:', diet)
      dietStore.selectDiet(diet)
      userStore.updateUser({ activeDietId: diet._id })
    }

    const updateDiet = async (dietId, updates) => {
      console.log('Diet.vue - updateDiet called:', dietId, updates)
      await dietStore.updateDiet(dietId, userStore.user._id, updates)
    }

    const deleteDiet = async (dietId) => {
      if (confirm('Are you sure you want to delete this diet?')) {
        await dietStore.deleteDiet(dietId, userStore.user._id)
        if (selectedDiet.value && selectedDiet.value._id === dietId) {
          selectedDiet.value = null
        }
      }
    }

    onMounted(async () => {
      await dietStore.fetchDiets(userStore.user._id)
    })

    return {
      showCreateForm,
      selectedDiet,
      diets,
      userStore,
      handleCreateDiet,
      selectDiet,
      updateDiet,
      deleteDiet
    }
  }
}
</script>

<style scoped>
input[type="range"] {
  -webkit-appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #10b981;
  cursor: pointer;
  border-radius: 50%;
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #10b981;
  cursor: pointer;
  border-radius: 50%;
  border: none;
}
</style>