'use strict'

class Player extends Body {
  constructor(wireframe) {
    const model = rotate(Math.PI / 2);
    const velocity = LA.Vector(Array)(2)();

    super(model, velocity, wireframe);

    this.lives = 3;
    this.score = 0;
    this.started = false;
    this.dead = true;
    this.spawning = false;
  }

  shoot(wireframe) {
    if (!this.started) {
      this.started = true;
      this.dead = false;
      this.spawning = true;
      setTimeout(() => this.spawning = false, 2000);
      return;
    }

    if (this.dead)
      return;

    const model = LA.Matrix(Array)(3)(this.model);

    return new Bullet(model, wireframe);
  }

  die() {
    if (this.spawning || !this.started)
      return;

    if (--this.lives <= 0)
      return;

    setTimeout(this.respawn.bind(this), 1500);
  }

  respawn() {
    this.model = rotate(Math.PI / 2);
    this.velocity = LA.Vector(Array)(2)();
    this.dead = false;
    this.spawning = true;

    setTimeout(() => {
      this.spawning = false;
      this.once = true;
    }, 2000);
  }
}
