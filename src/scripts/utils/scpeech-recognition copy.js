class SpeechRecognition {
    constructor() {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognitionAPI) {
            this.recognition = new SpeechRecognitionAPI();
            this.recognition.continuous = false; // Stop after user stops speaking
            this.recognition.interimResults = true;
            this.isListening = false;
            this.finalTranscript = '';
            this.callBacks = {}
        } else {
            this.recognition = null;
        }
    }

    isSupported() {
        return !!this.recognition;
    }

    start(callBacks) {
        const {onStart, onResult, onStop} = callBacks
        if (!this.isSupported()) return;
        
        this.finalTranscript = '';
        this.callBacks = callBacks

        this.recognition.onstart = () => {
            this.isListening = true;
            if (onStart) onStart();
        };
        
        this.recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            this.finalTranscript = transcript;
            if (onResult) onResult(transcript);
        };
        
        this.recognition.onspeechend = () => {
            this.isListening = false;
            this.recognition.stop();
            if (onStop) onStop(this.finalTranscript);
        };
        
        this.recognition.start();
    }

    destroy() {
        if (this.isSupported() && this.isListening) {
            this.recognition.stop();
            this.recognition = null;
        }
    }

    pause() {
        if (this.isSupported() && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        }
    }

    resume() {
        if (this.isSupported() && !this.isListening) {
            // const t = this
            this.start(this.callBacks);
        }
    }
}

export default SpeechRecognition