export const useTranscription = () => {
  let audioContext: AudioContext | null = null;
  let processor: ScriptProcessorNode | null = null;
  let socket: WebSocket | null = null;
  let stream: MediaStream | null = null;
  let source: MediaStreamAudioSourceNode | null = null;

  const transcript = ref("");

  const convertFloat32ToInt16 = (buffer: Float32Array) => {
    const l = buffer.length;
    const result = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      result[i] = buffer[i] * 0x7fff;
    }
    return result.buffer;
  };

  const startTranscription = async (deepgramKey: string) => {
    audioContext = new AudioContext();
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    source = audioContext.createMediaStreamSource(stream);
    processor = audioContext.createScriptProcessor(4096, 1, 1);
    source.connect(processor);
    processor.connect(audioContext.destination);

    socket = new WebSocket("wss://api.deepgram.com/v1/listen", [
      "token",
      deepgramKey,
    ]);

    socket.onopen = () => {
      console.log("✅ WebSocket connected to Deepgram");
      processor!.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const int16Data = convertFloat32ToInt16(inputData);
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(int16Data);
        }
      };
    };

    socket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      const result = data.channel?.alternatives?.[0]?.transcript;
      if (result) {
        transcript.value += result + " ";
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error", error);
    };
  };

  const stopTranscription = () => {
    processor?.disconnect();
    source?.disconnect();
    audioContext?.close();
    stream?.getTracks().forEach((track) => track.stop());
    socket?.close();
    console.log("🛑 Transcription stopped");
  };

  return {
    transcript,
    startTranscription,
    stopTranscription,
  };
};
