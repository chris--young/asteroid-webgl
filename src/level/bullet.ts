import LA from '../lib/la'
import Body from './body'

const BULLET_SPEED = 0.02;

export default class Bullet implements Body {

  model: number[][];
  velocity: number[][];
  wireframe: number[][];
  size: number;
  epoch: number;
  dead: boolean;

  constructor(model, wireframe) {
    const a = Math.atan2(model[1][0], model[1][1]);
    const x = Math.cos(a) * BULLET_SPEED;
    const y = Math.sin(a) * BULLET_SPEED;

    const velocity = LA.Vector(Array)(2)([x, y]);

    this.model = model;
    this.velocity = velocity;
    this.wireframe = wireframe;
    this.size = 1;
    this.epoch = Date.now();
    this.dead = false;
  }
}
