'use strict'

class Alien extends Body {
  constructor(wireframe) {
    const model = translate(0, 0.5);
    const velocity = LA.Vector(Array)(3)();

    super(model, velocity, wireframe);
  }
}

