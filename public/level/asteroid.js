'use strict'

const ASTEROID_MAX_SPEED = 0.01;

class Asteroid extends Body {
  constructor(wireframes, physics, size) {
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

    const velocity = LA.Vector(Array)(2)([x, y]);

    super(model, velocity, wireframes[i]);

    this.size = size;

    // doing this to get the closure around wireframes and physics, those should really just be globals or something
    this.explode = () => {
      const pieces = [];

      for (let x = 0; x < 3; ++x) {
        const piece = new Asteroid(wireframes, physics, this.size * 0.5);

        piece.model = LA.multiply(this.model, scale(0.5, 0.5));

        pieces.push(piece);
      }

      return pieces;
    };
  }
}
