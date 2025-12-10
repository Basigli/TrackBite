<!-- components/Toast.vue -->
<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50"
    >
      {{ message }}
    </div>
  </transition>
</template>

<script setup>
import { ref } from "vue";

const visible = ref(false);
const message = ref("");

const show = (msg) => {
  message.value = msg;
  visible.value = true;

  setTimeout(() => {
    visible.value = false;
  }, 2500);
};

// Make available to parent
defineExpose({ show });
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
