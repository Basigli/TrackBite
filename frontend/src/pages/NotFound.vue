<template>
  <div class="not-found max-w-5xl mx-auto p-6">
    <div class="bg-white rounded-lg shadow p-8 text-center">
      <div class="mb-6">
        <h1 class="text-9xl font-bold text-gray-800 mb-2">404</h1>
        <h2 class="text-3xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p class="text-gray-600 mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          @click="goHome" 
          class="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded transition"
        >
          Go to Dashboard
        </button>
        <button 
          @click="goBack" 
          class="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded transition"
        >
          Go Back
        </button>
      </div>

      <div class="mt-8 pt-8 border-t border-gray-200">
        <p class="text-sm text-gray-500">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'NotFound',
  setup() {
    const router = useRouter()

    const goHome = () => {
      router.push('/')
    }

    const goBack = () => {
      router.back()
    }

    return {
      goHome,
      goBack,
    }
  },
}
</script>

<style scoped>
.not-found {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>