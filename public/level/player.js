'use strict'

class Player extends Body {
  constructor(wireframe) {
    const model = rotate(Math.PI / 2);
    const velocity = LA.Vector(Array)(2)();

    super(model, velocity, wireframe);

    this.started = false;
    this.dead = true;
  }

  shoot(wireframe) {
    if (!this.started) {
      this.started = true;
      this.dead = false;
      return;
    }

    if (this.dead)
      return;

    const model = LA.Matrix(Array)(3)(this.model);

    return new Bullet(model, wireframe);
  }
}
