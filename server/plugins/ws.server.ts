import { WebSocketServer, WebSocket } from 'ws'
import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk'

export default defineNitroPlugin(() => {
  const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY!)
  const FASTAPI_WS_URL = process.env.FASTAPI_WS_URL || 'ws://localhost:8000/ws'

  const wss = new WebSocketServer({ port: 3003 })
  console.log('🧠 WebSocket server running at ws://localhost:3003')

  wss.on('connection', (ws) => {
    console.log('🔌 Client connected')

    // Connect to FastAPI WebSocket
    const fastApiWs = new WebSocket(FASTAPI_WS_URL)

    fastApiWs.on('open', () => {
      console.log('✅ Connected to FastAPI WebSocket')
    })

    fastApiWs.on('error', (error) => {
      console.error('⚠️ FastAPI WebSocket error:', error)
    })

    let keepAlive: ReturnType<typeof setInterval>

    const deepgram = deepgramClient.listen.live({
      language: 'en',
      punctuate: true,
      smart_format: true,
      model: 'nova-2-phonecall',
      multichannel: true,
      filler_words: true

    })

    keepAlive = setInterval(() => {
      console.log('⏳ Deepgram keepAlive ping')
      deepgram.keepAlive()
    }, 10_000)

    deepgram.addListener(LiveTranscriptionEvents.Open, () => {
      console.log('✅ Deepgram connected')

      deepgram.addListener(LiveTranscriptionEvents.Transcript, (data) => {
        // console.log(data)
        const transcript = data.channel?.alternatives[0]?.transcript
        if (transcript) {
          console.log('📤 Sending transcript to client:', transcript)

          // Send to browser client
          ws.send(JSON.stringify({ transcript }))

          // console.log(fastApiWs.readyState)

          // Send to FastAPI if connection is open
          // if (fastApiWs.readyState === WebSocket.OPEN) {
          fastApiWs.send(JSON.stringify({
            action: 'label',
            payload: {
              transcript: transcript
            }
          }))
          // }
        }
      })

      deepgram.addListener(LiveTranscriptionEvents.Close, () => {
        console.log('❌ Deepgram disconnected')
        clearInterval(keepAlive)
        deepgram.requestClose()
      })

      deepgram.addListener(LiveTranscriptionEvents.Error, (err) => {
        console.error('⚠️ Deepgram error:', err)
      })

      deepgram.addListener(LiveTranscriptionEvents.Metadata, (data) => {
        ws.send(JSON.stringify({ metadata: data }))
      })
    })


    fastApiWs.on('message', (data) => {
      const response = JSON.parse(data.toString())
      // Forward the labeled response to the browser client
      if (response.action === 'label') {
        ws.send(JSON.stringify(response))
      }
    })
    ws.on('message', (msg) => {
      if (deepgram.getReadyState() === 1) {
        deepgram.send(msg)
      } else {
        console.warn('🚫 Deepgram not ready. Reinitializing...')
        deepgram.requestClose()
        deepgram.removeAllListeners()
        // Optional: reconnect logic
      }
    })

    ws.on('close', () => {
      console.log('🔌 Client disconnected')
      clearInterval(keepAlive)
      deepgram.requestClose()
      deepgram.removeAllListeners()
      // Close FastAPI connection
      if (fastApiWs.readyState === WebSocket.OPEN) {
        fastApiWs.close()
      }
    })
  })
})
