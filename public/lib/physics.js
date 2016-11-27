'use strict'

const _360 = Math.PI * 2;
const SPEED = 0.005;
const MAX_SPEED = 0.03;
const ROTATION = _360 / 360 * 5;
const DRAG = -0.00001;
const RELOAD = 1000;

class Physics {
  constructor(canvas) {
    this.canvas = canvas;
    this.input = {};

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
    if (body.velocity[1][2] > 0)
      body.velocity = LA.multiply(translate(0, DRAG), body.velocity);
    else if (body.velocity[1][2] < 0)
      body.velocity = LA.multiply(translate(0, -DRAG), body.velocity);

    if (body.velocity[0][2] > 0)
      body.velocity = LA.multiply(translate(DRAG, 0), body.velocity);
    else if (body.velocity[0][2] < 0)
      body.velocity = LA.multiply(translate(-DRAG, 0), body.velocity);

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

      body.velocity = translate(x, y);
    }
  }

  static collision(body1, body2) {
    const bounds = body1.wireframe.bounds + body2.wireframe.bounds;

    const a = body1.model[0][2] - body2.model[0][2];
    const b = body1.model[1][2] - body2.model[1][2];

    const distance = Math.sqrt(Math.pow(a, 2) +  Math.pow(b, 2));

    if (distance > bounds)
      return false;

    function collide(body1, body2) {
      let u1 = body1.velocity[0][2];
      let u2 = body2.velocity[0][2];

      let m1 = 1;
      let m2 = 1;

      let v1 = ((u1 * (m1 - m2)) + (2 * m2 * u2)) / (m1 + m2); 
      let v2 = ((u2 * (m1 - m2)) + (2 * m2 * u1)) / (m1 + m2);

      body1.velocity[0][2] = v1;
      body2.velocity[0][2] = v2;

      let x1 = body1.model[0][2];
      let y1 = body1.model[1][2];
      let x2 = body2.model[0][2];
      let y2 = body2.model[1][2];

      let angle = Math.atan2(y1 - y2, x1, - x2);

      let d1 = body1.rotation;
      let d2 = 0;

      console.log({ d1, d2 });

      let v1x = u1 * Math.cos(d1 - a);
      let v1y = u1 * Math.sin(d1 - a);
      let v2x = u2 * Math.cos(d2 - a);
      let v2y = u2 * Math.sin(d2 - a);

      console.log({ v1x, v1y, v2x, v2y });

      let f1x = ((v1x * (m1 - m2)) + (2 * m2 * v2x)) / (m1 + m2); 
      let f2x = ((v2x * (m1 - m2)) + (2 * m2 * v1x)) / (m1 + m2); 

      v1 = Math.sqrt((Math.pow(f1x, 2) * Math.pow(f1x, 2)) + (v1y * Math.pow(v1y, 2)));
      v2 = Math.sqrt((Math.pow(f2x, 2) * Math.pow(f2x, 2)) + (v2y * Math.pow(v2y, 2)));

      console.log({ f1x, f2x, v1, v2 });
    }

    collide(body1, body2);

    body1.model = LA.multiply(body1.model, body1.velocity);
    body2.model = LA.multiply(body2.model, body2.velocity);

    return true;
  }
}

