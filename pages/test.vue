<template>
  <div class="chat-container">
    <div class="connection-status">
      Status: {{ isConnected ? 'Connected' : 'Disconnected' }}
    </div>
    
    <div class="messages">
      <div v-for="(message, index) in messages" :key="index">
        {{ message }}
      </div>
    </div>

    <div class="input-area">
      <Input v-model="messageText" @keyup.enter="handleSendMessage" />
      <Button @click="handleSendMessage">Send</Button>
    </div>
  </div>
</template>

<script setup>
const { connect, disconnect, sendMessage, messages, isConnected } = useWebSocket()
const messageText = ref('')

onMounted(() => {
  connect()
})

onUnmounted(() => {
  disconnect()
})

const handleSendMessage = () => {
  if (messageText.value) {
    sendMessage(messageText.value)
    messageText.value = ''
  }
}
</script>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.messages {
  height: 300px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px 0;
}

.input-area {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 5px;
}
</style>