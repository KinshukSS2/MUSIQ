// Sound Manager for retro gaming audio effects
class SoundManager {
  constructor() {
    this.enabled = localStorage.getItem('soundEnabled') !== 'false';
    this.sounds = {};
    this.audioContext = null;
    this.initialized = false;
  }

  // Initialize Web Audio API
  async init() {
    if (this.initialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      await this.createSounds();
      this.initialized = true;
    } catch (error) {
      console.warn('Audio not supported:', error);
    }
  }

  // Create retro gaming sounds using Web Audio API
  async createSounds() {
    const sampleRate = this.audioContext.sampleRate;

    // Button click sound - short beep
    this.sounds.click = this.createBeepSound(800, 0.1, sampleRate);
    
    // Navigation sound - higher pitched
    this.sounds.navigate = this.createBeepSound(1200, 0.15, sampleRate);
    
    // Success sound - ascending notes
    this.sounds.success = this.createChordSound([440, 554, 659], 0.3, sampleRate);
    
    // Error sound - descending buzz
    this.sounds.error = this.createBuzzSound(300, 0.2, sampleRate);
    
    // Hover sound - soft tick
    this.sounds.hover = this.createTickSound(600, 0.05, sampleRate);
    
    // Game action sound - power up
    this.sounds.gameAction = this.createPowerUpSound(sampleRate);
    
    // Toggle sound - switch flip
    this.sounds.toggle = this.createToggleSound(sampleRate);

    // Dice roll sound - multiple quick ticks
    this.sounds.diceRoll = this.createDiceRollSound(sampleRate);

    // Block select sound - satisfying click
    this.sounds.blockSelect = this.createBlockSelectSound(sampleRate);

    // Increment sound - upward pitch
    this.sounds.increment = this.createIncrementSound(sampleRate);

    // Decrement sound - downward pitch
    this.sounds.decrement = this.createDecrementSound(sampleRate);

    // Telephone dial sounds for different digits
    this.sounds.phoneDial = this.createPhoneDialSounds(sampleRate);
  }

  // Create a simple beep sound
  createBeepSound(frequency, duration, sampleRate) {
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 5); // Decay envelope
      data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3;
    }

    return buffer;
  }

  // Create a chord sound (multiple frequencies)
  createChordSound(frequencies, duration, sampleRate) {
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 3);
      let sample = 0;
      
      frequencies.forEach(freq => {
        sample += Math.sin(2 * Math.PI * freq * t);
      });
      
      data[i] = (sample / frequencies.length) * envelope * 0.2;
    }

    return buffer;
  }

  // Create a buzz sound for errors
  createBuzzSound(frequency, duration, sampleRate) {
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const envelope = 1 - (t / duration);
      const noise = (Math.random() - 0.5) * 0.1;
      data[i] = (Math.sin(2 * Math.PI * frequency * t) + noise) * envelope * 0.3;
    }

    return buffer;
  }

  // Create a soft tick sound
  createTickSound(frequency, duration, sampleRate) {
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 20);
      data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.1;
    }

    return buffer;
  }

  // Create a power-up sound
  createPowerUpSound(sampleRate) {
    const duration = 0.4;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const progress = t / duration;
      const frequency = 200 + (progress * 800); // Rising frequency
      const envelope = Math.sin(progress * Math.PI);
      data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.25;
    }

    return buffer;
  }

  // Create a toggle switch sound
  createToggleSound(sampleRate) {
    const duration = 0.1;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 10);
      const freq1 = Math.sin(2 * Math.PI * 800 * t);
      const freq2 = Math.sin(2 * Math.PI * 400 * t);
      data[i] = (freq1 + freq2) * envelope * 0.15;
    }

    return buffer;
  }

  // Create a dice rolling sound (multiple quick clicks)
  createDiceRollSound(sampleRate) {
    const duration = 0.8;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    // Create multiple quick ticks like dice hitting each other
    const numTicks = 8;
    const tickDuration = 0.05;
    const tickSpacing = duration / numTicks;

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      let sample = 0;

      for (let tick = 0; tick < numTicks; tick++) {
        const tickStart = tick * tickSpacing;
        const tickEnd = tickStart + tickDuration;
        
        if (t >= tickStart && t <= tickEnd) {
          const tickT = (t - tickStart) / tickDuration;
          const envelope = Math.exp(-tickT * 15);
          const frequency = 800 + (Math.random() * 400); // Random pitch variation
          const noise = (Math.random() - 0.5) * 0.3; // Add some noise for realism
          sample += Math.sin(2 * Math.PI * frequency * tickT) * envelope + noise;
        }
      }

      data[i] = sample * 0.2;
    }

    return buffer;
  }

  // Create a satisfying block selection sound
  createBlockSelectSound(sampleRate) {
    const duration = 0.2;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const progress = t / duration;
      
      // Create a satisfying "thock" sound
      const envelope = Math.exp(-t * 8) * (1 - progress * 0.5);
      const frequency = 400 + (progress * 200); // Slight frequency rise
      const subharmonic = Math.sin(2 * Math.PI * (frequency * 0.5) * t) * 0.3;
      const main = Math.sin(2 * Math.PI * frequency * t);
      
      data[i] = (main + subharmonic) * envelope * 0.25;
    }

    return buffer;
  }

  // Create an increment sound (rising pitch)
  createIncrementSound(sampleRate) {
    const duration = 0.15;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const progress = t / duration;
      
      // Rising frequency from 400Hz to 800Hz
      const frequency = 400 + (progress * 400);
      const envelope = Math.exp(-t * 6) * (1 - progress * 0.3);
      
      // Add a subtle harmonic for richness
      const main = Math.sin(2 * Math.PI * frequency * t);
      const harmonic = Math.sin(2 * Math.PI * (frequency * 1.5) * t) * 0.3;
      
      data[i] = (main + harmonic) * envelope * 0.2;
    }

    return buffer;
  }

  // Create a decrement sound (falling pitch)
  createDecrementSound(sampleRate) {
    const duration = 0.15;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const progress = t / duration;
      
      // Falling frequency from 800Hz to 400Hz
      const frequency = 800 - (progress * 400);
      const envelope = Math.exp(-t * 6) * (1 - progress * 0.3);
      
      // Add a subtle harmonic for richness
      const main = Math.sin(2 * Math.PI * frequency * t);
      const harmonic = Math.sin(2 * Math.PI * (frequency * 0.75) * t) * 0.3;
      
      data[i] = (main + harmonic) * envelope * 0.2;
    }

    return buffer;
  }

  // Create retro telephone dial sounds for each digit (DTMF-inspired)
  createPhoneDialSounds(sampleRate) {
    const duration = 0.12;
    const sounds = {};

    // DTMF frequencies for telephone digits (simplified retro version)
    const dialTones = {
      '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
      '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
      '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
      '0': [941, 1336]
    };

    Object.keys(dialTones).forEach(digit => {
      const length = sampleRate * duration;
      const buffer = this.audioContext.createBuffer(1, length, sampleRate);
      const data = buffer.getChannelData(0);
      const [freq1, freq2] = dialTones[digit];

      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const envelope = Math.exp(-t * 8) * (1 - Math.exp(-t * 50)); // Attack & decay
        const tone1 = Math.sin(2 * Math.PI * freq1 * t);
        const tone2 = Math.sin(2 * Math.PI * freq2 * t);
        data[i] = (tone1 + tone2) * envelope * 0.15;
      }

      sounds[digit] = buffer;
    });

    return sounds;
  }

  async play(soundName) {
    if (!this.enabled || !this.initialized) return;

    try {
      if (!this.sounds[soundName]) {
        console.warn(`Sound '${soundName}' not found`);
        return;
      }

      const source = this.audioContext.createBufferSource();
      source.buffer = this.sounds[soundName];
      source.connect(this.audioContext.destination);
      source.start();
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }

  // Play telephone dial sound for specific digit
  async playDigit(digit) {
    if (!this.enabled || !this.initialized) return;

    try {
      if (!this.sounds.phoneDial || !this.sounds.phoneDial[digit]) {
        console.warn(`Phone dial sound for digit '${digit}' not found`);
        return;
      }

      const source = this.audioContext.createBufferSource();
      source.buffer = this.sounds.phoneDial[digit];
      source.connect(this.audioContext.destination);
      source.start();
    } catch (error) {
      console.warn('Error playing digit sound:', error);
    }
  }

  // Toggle sound on/off
  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('soundEnabled', this.enabled.toString());
    
    // Play toggle sound when toggling
    if (this.enabled) {
      this.play('toggle');
    }
    
    return this.enabled;
  }

  // Check if sounds are enabled
  isEnabled() {
    return this.enabled;
  }

  // Initialize on user interaction
  async initOnUserInteraction() {
    if (!this.initialized) {
      await this.init();
    }
  }
}

// Create and export singleton instance
const soundManager = new SoundManager();

export default soundManager;