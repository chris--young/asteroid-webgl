export default class Audio {

  context: AudioContext;
  volume: number;
  muted: boolean;
  whiteNoise: AudioBuffer;

  constructor() {
    this.context = new AudioContext();

    if (!this.context)
      throw new Error('Unsupported browser');

    this.volume = 0.1;
    this.muted = true;

    this.whiteNoise = this.context.createBuffer(1, this.context.sampleRate * 0.75, this.context.sampleRate);

    for (let x = 0; x < this.whiteNoise.length; ++x)
      this.whiteNoise.getChannelData(0)[x] = Math.random() * 2 - 1;
  }

  beep(pitch: number, length: number): void {
    if (this.muted)
      return;

    const oscillator = this.context.createOscillator();
    const volume = this.context.createGain();

    volume.gain.value = this.volume;
    oscillator.type = 'square';
    oscillator.frequency.value = pitch;
    oscillator.connect(volume).connect(this.context.destination);
    oscillator.start();
    oscillator.stop(this.context.currentTime + length);
  }

  pewpew(): void {
    if (this.muted)
      return;

    const oscillator = this.context.createOscillator();
    const volume = this.context.createGain();

    volume.gain.value = this.volume;
    oscillator.type = 'triangle';
    oscillator.frequency.value = 4000;
    oscillator.frequency.linearRampToValueAtTime(400, this.context.currentTime + 0.25);
    oscillator.connect(volume).connect(this.context.destination);
    oscillator.start();
    oscillator.stop(this.context.currentTime + 0.25);
  }

  pshh(): void {
    if (this.muted)
      return;

    const noise = this.context.createBufferSource();
    const volume = this.context.createGain();

    noise.buffer = this.whiteNoise;
    volume.gain.value = this.volume;
    volume.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.75);
    noise.connect(volume).connect(this.context.destination);
    noise.start();
    noise.stop(this.context.currentTime + 0.75);
  }
}