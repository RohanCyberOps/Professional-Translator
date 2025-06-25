class SpeechService {
  private synthesis: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
  }

  /**
   * Loads available voices for text-to-speech
   */
  private loadVoices(): void {
    const updateVoices = () => {
      this.voices = this.synthesis.getVoices();
    };

    updateVoices();
    this.synthesis.onvoiceschanged = updateVoices;
  }

  /**
   * Speaks the given text in the specified language
   * @param text - Text to speak
   * @param languageCode - Language code for speech
   */
  speak(text: string, languageCode: string): void {
    if (!text.trim()) {
      return;
    }

    // Stop any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find appropriate voice for the language
    const voice = this.voices.find(v => 
      v.lang.toLowerCase().startsWith(languageCode.toLowerCase())
    );

    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    this.synthesis.speak(utterance);
  }

  /**
   * Stops any ongoing speech
   */
  stop(): void {
    this.synthesis.cancel();
  }

  /**
   * Checks if speech synthesis is supported
   * @returns boolean indicating support
   */
  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }
}

export const speechService = new SpeechService();