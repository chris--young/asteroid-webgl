'use strict'

class Player extends Body {
  constructor(wireframe) {
    const model = LA.Matrix(Array)(3)(LA.IDENTITY);
    const velocity = LA.Matrix(Array)(3)(LA.IDENTITY);

    super(model, velocity, wireframe);

    this.rotation = Math.PI / 2;
  }
}

