'use strict'

class Player extends Body {
  constructor(wireframe) {
    const model = rotate(Math.PI / 2);
    const velocity = LA.Vector(Array)(3)();

    super(model, velocity, wireframe);
  }
}

