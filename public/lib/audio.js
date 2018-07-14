'use strict'

class Audio {
  constructor() {
    this.context = new AudioContext();

    if (!this.context)
      throw new Error('Unsupported browser');

    this.volume = 0.1;
    this.muted = false;

    this.whiteNoise = new AudioBuffer({ sampleRate: this.context.sampleRate, length: this.context.sampleRate * 0.75, numberOfChannels: 1 });

    for (let x = 0; x < this.whiteNoise.length; ++x)
      this.whiteNoise.getChannelData(0)[x] = Math.random() * 2 - 1;
  }

  beep(pitch, length) {
    if (this.muted)
      return;

    const oscillator = new OscillatorNode(this.context);
    const volume = new GainNode(this.context, { gain: this.volume });

    oscillator.type = 'square';
    oscillator.frequency.value = pitch;
    oscillator.connect(volume).connect(this.context.destination);
    oscillator.start();
    oscillator.stop(this.context.currentTime + length);
  }

  pewpew() {
    if (this.muted)
      return;

    const oscillator = new OscillatorNode(this.context);
    const volume = new GainNode(this.context, { gain: this.volume });

    oscillator.type = 'triangle';
    oscillator.frequency.value = 4000;
    oscillator.frequency.linearRampToValueAtTime(400, this.context.currentTime + 0.25);
    oscillator.connect(volume).connect(this.context.destination);
    oscillator.start();
    oscillator.stop(this.context.currentTime + 0.25);
  }

  pshh() {
    if (this.muted)
      return;

    const noise = new AudioBufferSourceNode(this.context, { buffer: this.whiteNoise });
    const volume = new GainNode(this.context, { gain: this.volume });

    volume.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.75);
    noise.connect(volume).connect(this.context.destination);
    noise.start();
    noise.stop(this.context.currentTime + 0.75);
  }
}
