<template>
  <!-- Modal Overlay -->
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    style="background-color: rgba(0, 0, 0, 0.8);"
    @click.self="closeModal"
  >
    <!-- Modal Content -->
    <div class="bg-white rounded-lg shadow-xl max-w-xl w-full p-6">
      <!-- Modal Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Scan Barcode</h2>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Scanner Content -->
      <div class="space-y-4">
        <div class="bg-gray-50 rounded-lg p-4">
          <StreamBarcodeReader
            @decode="onDecode"
            @loaded="onLoaded"
            class="barcode-scanner"
          ></StreamBarcodeReader>
        </div>

        <div v-if="lastScannedCode" class="bg-green-50 border border-green-200 rounded-lg p-3">
          <p class="text-green-800 text-sm font-medium">
            Last scanned: <span class="font-bold">{{ lastScannedCode }}</span>
          </p>
        </div>

        <div class="text-sm text-gray-600 text-center">
          <p>Position the barcode within the camera view</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { StreamBarcodeReader } from 'vue-barcode-reader'

export default {
  name: 'BarcodeScannerModal',
  components: {
    StreamBarcodeReader
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'decode'],
  setup(props, { emit }) {
    const lastScannedCode = ref(null)

    const closeModal = () => {
      lastScannedCode.value = null
      emit('close')
    }

    const onDecode = (result) => {
      console.log('Barcode detected:', result)
      lastScannedCode.value = result
      emit('decode', result)
    }

    const onLoaded = () => {
      console.log('Scanner loaded successfully')
    }

    return {
      lastScannedCode,
      closeModal,
      onDecode,
      onLoaded
    }
  }
}
</script>

<style scoped>
.barcode-scanner {
  width: 100%;
  margin: 0 auto;
}
</style>
