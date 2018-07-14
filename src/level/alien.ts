import LA from '../lib/la'
import { translate } from '../lib/utils'
import Body from './body'

export default class Alien implements Body {

  model: number[][];
  velocity: number[][];
  wireframe: number[][];
  dead: boolean;
  size: number;

  constructor(wireframe) {
    const model = translate(0, 0.5);
    const velocity = LA.Vector(Array)(2)();

    this.model = model;
    this.velocity = velocity;
    this.wireframe = wireframe;
    this.dead = false;
    this.size = 1;
  }
}
