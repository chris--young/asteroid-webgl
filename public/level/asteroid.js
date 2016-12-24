'use strict'

const ASTEROID_MAX_SPEED = 0.01;

class Asteroid extends Body {
  constructor(wireframes, physics) {
    let i = between(0, wireframes.length - 1) | 0;
    let x = random(physics.ratio);
    let y = random(1);

    const model = LA.Matrix(Array)(3)([
      [1, 0, x],
      [0, 1, y],
      [0, 0, 1]
    ]);

    x = random(ASTEROID_MAX_SPEED);
    y = random(ASTEROID_MAX_SPEED);

    const velocity = LA.Vector(Array)(3)([x, y, 0]);

    super(model, velocity, wireframes[i]);
  }
}
