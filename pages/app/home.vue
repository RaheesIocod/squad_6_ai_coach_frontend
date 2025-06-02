<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

import { useTemplateRef } from 'vue'

const el = useTemplateRef<HTMLElement>('el')




import { useStorage } from '@vueuse/core'
const route = useRoute()
const isConnected = ref(false)
const isRecording = ref(false)
const transcription = ref('')
const transcriptions = ref([]) // Add this new ref for storing all transcriptions
// const labels = ref<any[]>(
//   [
//     { "speaker": "Rep", "text": "Hello. This is Sam from easy find. I just got your inquiry", "time": "7:09:36 AM" }, { "speaker": "Unknown", "text": "Yes, Sam. This is John. I just need to know the", "time": "7:09:42 AM" },
//     { "speaker": "Prospect", "text": "pricing of Easyfy. So could you explain that here?", "prospect": true, "suggestion": "Easify offers four pricing plans: \n\n1. **Basic**: $49/month - includes 4,500 credits, 1 phone number, and 5 sub-accounts.\n2. **Premium**: $99/month - includes 11,000 credits, 2 phone numbers, and 10 sub-accounts (most popular).\n3. **Enterprise**: $199/month - includes 25,000 credits, 2 phone numbers, and 15 sub-accounts.\n4. **Custom Plan**: Tailored to specific business needs.\n\nAll plans come with a 7-day free trial, no credit card required, and no hidden charges.", "time": "7:09:49 AM" },
//     { "speaker": "Prospect", "text": "pricing of Easyfy. So could you explain that here?", "prospect": true, "suggestion": "Easify offers four pricing plans: \n\n1. **Basic**: $49/month - includes 4,500 credits, 1 phone number, and 5 sub-accounts.\n2. **Premium**: $99/month - includes 11,000 credits, 2 phone numbers, and 10 sub-accounts (most popular).\n3. **Enterprise**: $199/month - includes 25,000 credits, 2 phone numbers, and 15 sub-accounts.\n4. **Custom Plan**: Tailored to specific business needs.\n\nAll plans come with a 7-day free trial, no credit card required, and no hidden charges.", "time": "7:09:49 AM" }
//   ]
// )
const labels = ref<any[]>([])
const ws = ref<WebSocket | null>(null)
const mediaRecorder = ref<MediaRecorder | null>(null)
const config = useRuntimeConfig()

const connectionStatus = computed(() =>
  isConnected.value ? 'Connected' : 'Disconnected'
)

// Initialize WebSocket connection
const initWebSocket = () => {
  ws.value = new WebSocket(config.public.websocket)

  ws.value.onopen = () => {
    isConnected.value = true
    console.log('WebSocket Connected')
  }

  // Modify the WebSocket onmessage handler
  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data)
    const currentTime = new Date().toLocaleTimeString()

    if (data.transcript) {
      transcription.value = data.transcript
      // Add new transcription to the array with timestamp
      if (data.transcript.trim()) {
        transcriptions.value.push({
          text: data.transcript,
          time: currentTime
        })
      }
    }
    // Handle labeled data from FastAPI
    if (data.action === 'label' && data.result) {
      const labeledDataWithTime = data.result.map(item => ({
        ...item,
        time: currentTime
      }))
      labels.value = [...labels.value, ...labeledDataWithTime]
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

const audioStream = ref<MediaStream | null>(null)

// Initialize audio recording
const initRecording = async () => {
  try {
    const micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
      },
    })

    audioStream.value = micStream

    const recorder = new MediaRecorder(micStream)
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0 && ws.value?.readyState === WebSocket.OPEN) {
        ws.value.send(event.data)
      }
    }

    recorder.onstop = () => {
      micStream.getTracks().forEach(track => track.stop())
    }

    mediaRecorder.value = recorder
  } catch (error) {
    console.error('Error capturing audio:', error)
  }
}

const state = useStorage<{ data: any[] }>('call-info-state', { data: [] })

const cookie = useCookie('token')
const token = cookie.value
const loading = ref(false)
function GoToCallInfo() {
  loading.value = true

  // Navigate to the call info page
  // state.value.data = labels.value
  // navigateTo({ path: 'call-info' })
  $fetch(`${config.public.apiBaseUrl}/responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: {
      response: labels.value,
    },
  })
    .then((response) => {
      navigateTo({ path: `/app/call-report/${response?.data?.id}` })

      // Optionally, navigate to the call info page
      // navigateTo({ path: '/app/call-info' })
    })
    .catch((error) => {
      console.error('Error saving call info:', error)
    }).finally(() => {
      loading.value = false
    })
}



// Toggle recording
const toggleRecording = async () => {
  if (!isRecording.value) {
    await initRecording() // <- Re-initialize on each start
    mediaRecorder.value?.start(250)
    isRecording.value = true
  } else {
    mediaRecorder.value?.stop()
    isRecording.value = false
    mediaRecorder.value = null
    audioStream.value = null
    GoToCallInfo()
  }
}

const callEnd = computed(() => {
  return route.query.callEnd === 'true'
})
// Initialize on component mount
onMounted(() => {
  initWebSocket()
  initRecording()
})


// watch(()=>transcriptions.value.length, (val) => {
//   // Get the last transcription whenever the array length changes
//   if (transcriptions.value.length > 0) {
//     const lastTranscription = transcriptions.value[transcriptions.value.length - 1]
//     console.log('Latest transcription:', lastTranscription)
//   }
// })

// Cleanup on component unmount
onUnmounted(() => {
  if (isRecording.value && mediaRecorder.value) {
    mediaRecorder.value.stop()
  }
  ws.value?.close()
  transcriptions.value = [] // Clear transcriptions on unmount

})

const userDetails = computed(() => {
  return JSON.parse(localStorage.getItem('user') || '{}')
})
</script>


<template>
  <!-- <div v-if="callEnd" class="w-full space-y-6">
    <div class="flex items-center justify-between">
      <div class="text-[24px] font-bold">
        Calls Reports
      </div>
      <div class="text-xs text-gray-500 font-normal">
        Detailed analysis and coaching insights from your sales calls
      </div>
    </div>
  </div> -->

  <div class="relative">
    <div v-if="isRecording && transcription"
      class="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#21222378] text-white px-6 py-3 rounded-lg max-w-2xl w-full text-center transition-opacity duration-300">
      {{ transcription }}
    </div>
    <div>

      <div class="text-[24px] font-bold">
        Welcome Back, {{ userDetails.name }}👋
      </div>
      <div class="text-gray-500 text-sm">
        Ready to transcribe your audio?
      </div>

    </div>
    <div class="grid grid-col-1 md:grid-cols-2 gap-6 ">
      <!-- {{ transcriptions }} -->
      <div class="flex flex-col gap-4 bg-slate-50 p-6 rounded-lg">
        <!-- Status indicator -->
        <!-- <div class="flex items-center gap-2">
        <div :class="`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`" />
        <span>{{ connectionStatus }}</span>
      </div> -->

        <div class="bg-white rounded-lg p-6 h-[70ch] overflow-y-auto">
          <!-- Controls -->

          <div class="flex gap-4 justify-between">
            <div class="flex flex-col flex-wrap">
              <div class="flex items-center gap-2">
                <Icon name="my-icon:live-transcript" size="24"></Icon>
                <div class="font-semibold text-[20px] text-nowrap">
                  Live Transcript
                </div>
              </div>
              <div class="text-sm text-gray-500">
                Real-time conversation
              </div>
            </div>
            <Button :disabled="loading" :class="`px-4 py-2 rounded-lg cursor-pointer ${(isRecording || loading) ? 'bg-red-500 hover:bg-red-500/80' : 'bg-custom'
              } text-white !font-normal rounded`" @click="toggleRecording">
              {{ (isRecording || loading) ? 'Stop sensAi' : ' Start sensAi' }}
              <Icon v-if="loading" name="lucide:loader" class="animate-spin"></Icon>
            </Button>
          </div>

          <!-- Transcription output -->
          <div class="mt-6 rounded-lg overflow-y-auto">
            <div v-for="(label, index) in [...labels].reverse()" :key="index" class="mb-4">
              <div class="flex items-center gap-x-4 bg-[#F1F5F9] p-3 rounded-lg">
                <div class="space-y-1">
                  <div :class="label.speaker === 'Prospect' ? 'bg-gray-300 text-black' : 'bg-black text-white'"
                    class="font-medium text-xs rounded-full min-w-[67px] py-[3px] px-[11px] text-center">
                    {{ label.speaker }}
                  </div>
                  <div class="text-[11px] font-normal text-gray-500 text-center">
                    {{ label.time }}
                  </div>
                </div>
                <p class="text-sm">{{ label.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- {{ labels }} -->
      <!-- Labels column -->
      <div class="flex flex-col gap-4 bg-slate-50 p-6 rounded-lg">
        <div class="bg-white rounded-lg p-6 h-full max-h-[85vh] overflow-y-auto ">
          <div class=" mb-4">
            <div class="flex items-center gap-2">
              <Icon name="my-icon:ai" size="24"></Icon>
              <div class="text-[20px] font-semibold">
                sensAi Suggests
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-500">
                Suggestions based on conversation
              </div>
            </div>
          </div>
          <div v-for="(label, index) in labels" :key="index" class="mb-2">
            <div class="flex gap-x-4" v-if="label.suggestion">
              <Icon name="my-icon:ai" size="24"></Icon>


              <div class="flex-1 text-sm space-y-1">
                <p class="text-gray-700">{{ label.text }}</p>
                <p v-if="label.suggestion" class=" text-black mt-1 font-medium">
                  {{ label.suggestion }}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

</template>



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