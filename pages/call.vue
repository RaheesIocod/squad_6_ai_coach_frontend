<template>
  <div class="p-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Transcription Section -->
      <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-lg font-semibold mb-4">Live Transcription</h2>
        <div class="h-[400px] overflow-y-auto">
          <p>{{ transcription }}</p>
        </div>
      </div>

      <!-- Labels Section -->
      <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-lg font-semibold mb-4">Conversation Labels</h2>
        <div class="h-[400px] overflow-y-auto">
          <div v-for="(label, index) in labels" :key="index" class="mb-2">
            <div class="flex items-start gap-2">
              <span class="px-2 py-1 rounded text-sm" 
                    :class="getLabelColor(label.type)">
                {{ label.type }}
              </span>
              <p class="text-gray-700">{{ label.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const transcription = ref('')
const labels = ref<any[]>([])
const ws = ref<WebSocket | null>(null)

// Initialize WebSocket connection
onMounted(() => {
  ws.value = new WebSocket('ws://localhost:3003')
  
  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data)
    
    if (data.transcript) {
      transcription.value = data.transcript
    }
    
    if (data.type === 'label' && data.data) {
      labels.value = [...labels.value, ...data.data]
    }
  }
})

// Clean up WebSocket connection
onUnmounted(() => {
  if (ws.value) {
    ws.value.close()
  }
})

// Helper function for label colors
const getLabelColor = (type: string) => {
  const colors: Record<string, string> = {
    'question': 'bg-blue-100 text-blue-800',
    'answer': 'bg-green-100 text-green-800',
    'statement': 'bg-gray-100 text-gray-800',
    'objection': 'bg-red-100 text-red-800'
  }
  return colors[type.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

// Add authentication middleware
// definePageMeta({
//   middleware: ['auth']
// })
</script>

<style scoped>
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #CBD5E0 #EDF2F7;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #EDF2F7;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #CBD5E0;
  border-radius: 4px;
}
</style>