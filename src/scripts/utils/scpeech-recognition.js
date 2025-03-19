import { RealtimeService } from './assemblyai'

function mergeBuffers(lhs, rhs) {
    const mergedBuffer = new Int16Array(lhs.length + rhs.length)
    mergedBuffer.set(lhs, 0)
    mergedBuffer.set(rhs, lhs.length)
    return mergedBuffer
}

function createMicrophone() {
    let stream;
    let audioContext;
    let audioWorkletNode;
    let source;
    let audioBufferQueue = new Int16Array(0);
    return {
        async requestPermission() {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        },
        async startRecording(onAudioCallback) {
        if (!stream) stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new AudioContext({
            sampleRate: 16_000,
            latencyHint: 'balanced'
        });
        source = audioContext.createMediaStreamSource(stream);

        await audioContext.audioWorklet.addModule('audio-processor.js');
        audioWorkletNode = new AudioWorkletNode(audioContext, 'audio-processor');

        source.connect(audioWorkletNode);
        audioWorkletNode.connect(audioContext.destination);
        audioWorkletNode.port.onmessage = (event) => {
            const currentBuffer = new Int16Array(event.data.audio_data);
            audioBufferQueue = mergeBuffers(
                audioBufferQueue,
                currentBuffer
            );

            const bufferDuration =
            (audioBufferQueue.length / audioContext.sampleRate) * 1000;

            // wait until we have 100ms of audio data
            if (bufferDuration >= 100) {
            const totalSamples = Math.floor(audioContext.sampleRate * 0.1);

            const finalBuffer = new Uint8Array(
                audioBufferQueue.subarray(0, totalSamples).buffer
            );

            audioBufferQueue = audioBufferQueue.subarray(totalSamples)
            if (onAudioCallback) onAudioCallback(finalBuffer);
            }
        }
        },
        stopRecording() {
        stream?.getTracks().forEach((track) => track.stop());
        audioContext?.close();
        audioBufferQueue = new Int16Array(0);
        }
    }
}

class SpeechRecognition {
    constructor(){
        this.isRecording = false
        this.texts = {}
    }

    async init(token, call_backs = {}){
        if(!navigator.mediaDevices){
            if(call_backs.onError) call_backs.onError("Not supported")
            return
        }

        this.microphone = createMicrophone()


        const rt = new RealtimeService({ token })


        let lastMessage = "";
        let lastSpokenAt = null;
        let silenceTimer = null;

        rt.on("transcript", (message) => {
            const texts = this.texts;
            let msg = "";
            texts[message.audio_start] = message.text;
            const keys = Object.keys(texts);
            keys.sort((a, b) => a - b);
            
            for (const key of keys) {
                if (texts[key]) {
                    msg += ` ${texts[key]}`;
                }
            }
            
            if (call_backs.onTranscript) call_backs.onTranscript(msg);

            if (msg !== lastMessage) {
                lastMessage = msg;
                lastSpokenAt = Date.now();

                // Reset the silence detection timer
                if (silenceTimer) clearTimeout(silenceTimer)
                
                silenceTimer = setTimeout(() => {
                    const timeSinceLastSpeech = Date.now() - lastSpokenAt
                    if (timeSinceLastSpeech >= 1000 && message) {
                        this.texts = {}
                        if (call_backs.onCompleteSentence) call_backs.onCompleteSentence(msg)
                    }
                }, 1000)
            }
        })

        rt.on("error", async (error) => {
            if(call_backs.onError) call_backs.onError(error)
            await rt.close();
        })

        rt.on("close", (event) => {
            if(call_backs.onClose) call_backs.onClose(event)
            this.rt = null;
        })

        this.rt = rt
        await rt.connect()
        await this.microphone.startRecording((audioData) => {
            rt.sendAudio(audioData);
        })
        if(call_backs.onInit) call_backs.onInit()
        this.isRecording = true
    }

    async stop(){
        if(this.rt){
            await this.rt.close(false)
            this.rt = null
        }

        if(this.microphone){
            this.microphone.stopRecording()
            this.microphone = null
        }
    }
}

export default SpeechRecognition