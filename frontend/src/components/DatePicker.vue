<template>
  <div class="date-picker-container relative">
    <button
      @click="toggleDatePicker"
      class="date-picker-button flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/30"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span class="font-medium">{{ formattedDate }}</span>
      <svg
        class="w-4 h-4 transition-transform duration-200"
        :class="{ 'rotate-180': datePickerOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Custom date picker dropdown -->
    <transition name="slide-fade">
      <div
        v-if="datePickerOpen"
        class="absolute right-0 mt-2 bg-white text-gray-800 rounded-xl shadow-2xl w-72 p-4 z-50 border border-gray-200"
        @click.stop
      >
        <!-- Quick select buttons -->
        <div class="flex gap-2 mb-3">
          <button
            @click="selectToday"
            class="flex-1 px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Today
          </button>
          <button
            @click="selectYesterday"
            class="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Yesterday
          </button>
        </div>

        <!-- Native date input styled -->
        <input
          type="date"
          v-model="localDate"
          @change="dateChanged"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700 cursor-pointer"
        />

        <!-- Navigation buttons -->
        <div class="flex justify-between mt-3 gap-2">
          <button
            @click="previousDay"
            class="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          <button
            @click="nextDay"
            class="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Next
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useIntakeStore } from '@/store/intakeStore'
import { useUserStore } from '@/store/userStore'
import { storeToRefs } from 'pinia'

const intakeStore = useIntakeStore()
const userStore = useUserStore()
const { selectedDate } = storeToRefs(intakeStore)

const datePickerOpen = ref(false)
const localDate = ref(selectedDate.value || new Date().toISOString().substr(0, 10))

// Sync localDate with store
watch(selectedDate, (newVal) => {
  localDate.value = newVal
})

const formattedDate = computed(() => {
  if (!localDate.value) return 'Select Date'
  const date = new Date(localDate.value)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
})

const toggleDatePicker = () => {
  datePickerOpen.value = !datePickerOpen.value
}

const selectToday = () => {
  localDate.value = new Date().toISOString().substr(0, 10)
  dateChanged()
  datePickerOpen.value = false
}

const selectYesterday = () => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  localDate.value = yesterday.toISOString().substr(0, 10)
  dateChanged()
  datePickerOpen.value = false
}

const previousDay = () => {
  const date = new Date(localDate.value)
  date.setDate(date.getDate() - 1)
  localDate.value = date.toISOString().substr(0, 10)
  dateChanged()
}

const nextDay = () => {
  const date = new Date(localDate.value)
  date.setDate(date.getDate() + 1)
  localDate.value = date.toISOString().substr(0, 10)
  dateChanged()
}

const dateChanged = () => {
  intakeStore.setSelectedDate(localDate.value)
  const userId = userStore.user?._id
  if (userId) {
    intakeStore.fetchDailyIntake(userId)
  }
}

// Close dropdown when clicking outside
const closeOnClickOutside = (event) => {
  if (!event.target.closest('.date-picker-container')) {
    datePickerOpen.value = false
  }
}

// Add event listener when component mounts
if (typeof window !== 'undefined') {
  window.addEventListener('click', closeOnClickOutside)
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.15s ease-in;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Custom scrollbar for date picker */
.date-picker-container ::-webkit-scrollbar {
  width: 6px;
}

.date-picker-container ::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.date-picker-container ::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.date-picker-container ::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>