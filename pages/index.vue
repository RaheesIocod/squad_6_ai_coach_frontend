<template>
  <div class="p-4">
    <div class="flex flex-col gap-4">
      <!-- Status indicator -->
      <div class="flex items-center gap-2">
        <div :class="`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`"/>
        <span>{{ connectionStatus }}</span>
      </div>

      <!-- Controls -->
      <div class="flex gap-4">
        <button
          :class="`px-4 py-2 rounded-lg ${
            isRecording ? 'bg-red-500' : 'bg-blue-500'
          } text-white`"
          @click="toggleRecording"
        >
          {{ isRecording ? 'Stop Recording' : 'Start Recording' }}
        </button>
      </div>

      <!-- Transcription output -->
      <div class="mt-4 p-4 bg-gray-100 rounded-lg min-h-[200px] max-h-[400px] overflow-y-auto">
        <p v-for="(text, index) in transcriptions" :key="index">
          {{ text }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isConnected = ref(false)
const isRecording = ref(false)
const transcription = ref('')
const transcriptions = ref<string[]>([]) // Add this new ref for storing all transcriptions
const ws = ref<WebSocket | null>(null)
const mediaRecorder = ref<MediaRecorder | null>(null)

const connectionStatus = computed(() => 
  isConnected.value ? 'Connected' : 'Disconnected'
)

// Initialize WebSocket connection
const initWebSocket = () => {
  ws.value = new WebSocket('ws://localhost:3003')

  ws.value.onopen = () => {
    isConnected.value = true
    console.log('WebSocket Connected')
  }

  // Modify the WebSocket onmessage handler
  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.transcript) {
      transcription.value = data.transcript
      // Add new transcription to the array
      if (data.transcript.trim()) {
        transcriptions.value.push(data.transcript)
      }
    }
  }

  ws.value.onclose = () => {
    isConnected.value = false
    console.log('WebSocket Disconnected')
  }

  ws.value.onerror = (error) => {
    console.error('WebSocket Error:', error)
  }
}

// Initialize audio recording
const initRecording = async () => {
    try {
        // Request screen capture
        // const screenStream = await navigator.mediaDevices.getDisplayMedia({
        //     video: false,
        //     audio: true
        // });

        // Request microphone audio
        const micStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44100
            }
        });

        // Combine the audio tracks from both streams
        const combinedStream = new MediaStream([
            // ...screenStream.getAudioTracks(),
            ...micStream.getAudioTracks(),
            // ...screenStream.getVideoTracks()
        ]);

        // Create a new MediaRecorder instance
        mediaRecorder.value = new MediaRecorder(combinedStream);

        mediaRecorder.value.ondataavailable = (event) => {
            if (event.data.size > 0 && ws.value?.readyState === WebSocket.OPEN) {
                ws.value.send(event.data);
            }
        };

        mediaRecorder.value.onstop = () => {
            combinedStream.getTracks().forEach(track => track.stop());
        };

    } catch (error) {
        console.error('Error capturing audio/video:', error);
    }
};


// Toggle recording
const toggleRecording = () => {
  if (!mediaRecorder.value) return

  if (!isRecording.value) {
    mediaRecorder.value.start(250) // Send data every 250ms
    isRecording.value = true
  } else {
    mediaRecorder.value.stop()
    isRecording.value = false
  }
}

// Initialize on component mount
onMounted(() => {
  initWebSocket()
  initRecording()
})

// Cleanup on component unmount
onUnmounted(() => {
  if (isRecording.value && mediaRecorder.value) {
    mediaRecorder.value.stop()
  }
  ws.value?.close()
  transcriptions.value = [] // Clear transcriptions on unmount
})
</script>

<style scoped>
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #CBD5E0 #EDF2F7;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #EDF2F7;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #CBD5E0;
  border-radius: 4px;
}
</style>