'use strict'

const BULLET_SPEED = 0.02;
const BULLET_AGE = 3000;

class Bullet extends Body {
  constructor(model, wireframe) {
    const a = Math.atan2(model[1][0], model[1][1]);
    const x = Math.cos(a) * BULLET_SPEED;
    const y = Math.sin(a) * BULLET_SPEED;

    const velocity = LA.Vector(Array)(3)([x, y, 0]);

    super(model, velocity, wireframe);

    this.epoch = Date.now();
  }
}
