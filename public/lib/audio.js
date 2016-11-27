'use strict'

class Audio {
  constructor() {
    this.context = new AudioContext();

    if (!this.context)
      throw new Error('Unsupported browser');
  }

  beep(pitch, length) {
    const oscillator = this.context.createOscillator();

    oscillator.type = 'triangle';
    oscillator.frequency.value = pitch;
    oscillator.connect(this.context.destination);
    oscillator.start();

    setTimeout(() => oscillator.stop(), length);
  }
}

