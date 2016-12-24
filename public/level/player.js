'use strict'

class Player extends Body {
  constructor(wireframe) {
    const model = rotate(Math.PI / 2);
    const velocity = LA.Vector(Array)(3)();

    super(model, velocity, wireframe);
  }

  shoot(wireframe) {
    const model = LA.Matrix(Array)(3)(this.model);

    model[1][2] += this.wireframe.bounds + wireframe.bounds * 2;

    return new Bullet(model, wireframe);
  }
}
