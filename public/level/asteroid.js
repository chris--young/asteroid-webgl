'use strict'

const flip = () => Math.random() < 0.5;
const between = (min, max) => Math.random() * (max - min + 1) + min;
const random = abs => flip() ? Math.random() * abs : Math.random() * -abs;

function asteroid() {
  let x = random(physics.ratio);
  let y = random(1);
  let s = 1;
  let i = between(0, 2) | 0;

  let model = LA.Matrix(Array)(3)([
    [s, 0, x],
    [0, s, y],
    [0, 0, 1]
  ]);

  let wireframe = Object.assign({}, assets.wireframes.asteroids[i]);

  return {
    model: model,
    velocity: LA.Matrix(Array)(3)(LA.IDENTITY),
    wireframe: wireframe
  };
}

const TIMEOUT = 3000;

function place() {
  const start = Date.now();

  let a = asteroid();
  let look = true;

  while (look) {
    if (Date.now() - start > TIMEOUT)
      break;

    let collision = false;
    let index = 0;

    while (!collision && index < bodies.length) {
      let vec = Physics.collision(a, bodies[index++]);
      if (vec) {
        console.log({ vec });
        //a.model[0][2] += Math.cos(angle);
        //a.model[1][2] += Math.sin(angle);
        a.model = LA.multiply(vec, a.model);
        collision = true;
      }
    }

    if (!collision)
      look = false;
  }

  return a;
}

