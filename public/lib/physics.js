'use strict'

const _360 = Math.PI * 2;
const SPEED = 0.01;
const ROTATION = _360 / 360 * 5;
const DRAG = -0.00005;
const RELOAD = 1001;

class Body {
  constructor(model, velocity, wireframe) {
    this.model = model;
    this.velocity = velocity;
    this.wireframe = wireframe;
  }
}

class Physics {
  constructor(canvas) {
    this.canvas = canvas;
    this.input = { timestamp: Date.now() };

    this.resize();

    document.addEventListener('keydown', event => this.input[event.which] = true);
    document.addEventListener('keyup', event => this.input[event.which] = false);

    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;
    this.ratio = this.width / this.height;
  }

  update(body) {
    if (body instanceof Player) {
      if (body.velocity[1][2] > 0)
        body.velocity = LA.multiply(translate(0, DRAG), body.velocity);
      else if (body.velocity[1][2] < 0)
        body.velocity = LA.multiply(translate(0, -DRAG), body.velocity);

      if (body.velocity[0][2] > 0)
        body.velocity = LA.multiply(translate(DRAG, 0), body.velocity);
      else if (body.velocity[0][2] < 0)
        body.velocity = LA.multiply(translate(-DRAG, 0), body.velocity);
    }

    if (body.model[1][2] - body.wireframe.bounds > 1)
      body.model = LA.multiply(translate(0, -2), body.model);
    else if (body.model[1][2] + body.wireframe.bounds < -1)
      body.model = LA.multiply(translate(0, 2), body.model);

    if (body.model[0][2] - body.wireframe.bounds > this.ratio)
      body.model = LA.multiply(translate(-this.ratio * 2, 0), body.model);
    else if (body.model[0][2] + body.wireframe.bounds < -this.ratio)
      body.model = LA.multiply(translate(this.ratio * 2, 0), body.model);

    body.model = LA.multiply(body.velocity, body.model);
  }

  control(body) {
    if (this.input[37]) {
      if (body.rotation <= _360)
        body.rotation += ROTATION;
      else
        body.rotation = 0;

      body.model = LA.multiply(body.model, rotate(ROTATION));
    }

    if (this.input[39]) {
      if (body.rotation > 0)
        body.rotation -= ROTATION;
      else
        body.rotation = _360;

      body.model = LA.multiply(body.model, rotate(-ROTATION));
    }

    if (this.input[38]) {
      let x = Math.cos(body.rotation) * SPEED;
      let y = Math.sin(body.rotation) * SPEED;

      body.velocity = translate(x, y); // LA.multiply(translate(x, y), body.velocity);
    }
  }

  static collision(body1, body2) {
    const bounds = body1.wireframe.bounds + body2.wireframe.bounds;

    const a = body1.model[0][2] - body2.model[0][2];
    const b = body1.model[1][2] - body2.model[1][2];

    const distance = Math.sqrt(Math.pow(a, 2) +  Math.pow(b, 2));

    if (distance > bounds)
      return false;

    const x1 = body1.velocity[0][2];
    const y1 = body1.velocity[1][2];

    const x2 = body2.velocity[0][2];
    const y2 = body2.velocity[1][2];

    body1.velocity[0][2] = x2;
    body1.velocity[1][2] = y2;

    body2.velocity[0][2] = x1;
    body2.velocity[1][2] = y1;

    return true;
  }
}

