export const useWebSocket = () => {
  const socket = ref<WebSocket | null>(null)
  const messages = ref<string[]>([])
  const isConnected = ref(false)

  const connect = () => {
    socket.value = new WebSocket('ws://localhost:8000/ws')
    
    socket.value.onopen = () => {
      isConnected.value = true
      console.log('WebSocket connected')
    }

    socket.value.onmessage = (event) => {
      messages.value.push(event.data)
    }

    socket.value.onclose = () => {
      isConnected.value = false
      console.log('WebSocket disconnected')
    }
  }

  const sendMessage = (message: string) => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.send(message)
    }
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.close()
      socket.value = null
    }
  }

  return {
    connect,
    disconnect,
    sendMessage,
    messages,
    isConnected
  }
}