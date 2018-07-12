'use strict'

class Audio {
  constructor() {
    this.context = new AudioContext();
    this.muted = false;

    if (!this.context)
      throw new Error('Unsupported browser');
  }

  beep(pitch, length) {
    if (this.muted)
      return;

    const oscillator = this.context.createOscillator();

    oscillator.type = 'square';
    oscillator.frequency.value = pitch;
    oscillator.connect(this.context.destination);
    oscillator.start();

    setTimeout(() => oscillator.stop(), length);
  }

  pewpew() {
    if (this.muted)
      return;

    const oscillator = this.context.createOscillator();

    oscillator.type = 'triangle';
    oscillator.frequency.value = 4000;
    oscillator.frequency.linearRampToValueAtTime(400, this.context.currentTime + 0.25);
    oscillator.connect(this.context.destination);
    oscillator.start();

    setTimeout(() => oscillator.stop(), 250);
  }

  pshh() {
    if (this.muted)
      return;

    const size = 2 * this.context.sampleRate;
    const buffer = this.context.createBuffer(1, size, this.context.sampleRate);
    const out = buffer.getChannelData(0);

    for (let x = 0; x < size; ++x)
      out[x] = Math.random() * 2 - 1;

    const noise = this.context.createBufferSource();
    const volume = this.context.createGain();

    noise.buffer = buffer;
    volume.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.75);
    noise.connect(volume);
    volume.connect(this.context.destination);
    noise.start();

    setTimeout(() => noise.stop(), 750);
  }
}
