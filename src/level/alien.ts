import Body from "../lib/body"
import LA from "../lib/la"
import { translate } from "../lib/utils"
import Wireframe from "../lib/wireframe"

export default class Alien implements Body {

	model: number[][];
	velocity: number[];
	wireframe: Wireframe;
	dead: boolean;
	size: number;

	constructor(wireframe: Wireframe) {
		const model = translate(0, 0.5);
		const velocity = LA.Vector(Array)(2)();

		this.model = model;
		this.velocity = velocity;
		this.wireframe = wireframe;
		this.dead = false;
		this.size = 1;
	}

}
