import Body from "../lib/body"
import Wireframe from "../lib/wireframe"

const BULLET_SPEED = 0.02;

export default class Bullet extends Body {

	position: number[];
	rotation: number;
	velocity: number[];
	wireframe: Wireframe;
	size: number;
	epoch: number;
	dead: boolean;

	constructor(position: number[], rotation: number, wireframe: Wireframe) {
		const x = Math.cos(rotation) * BULLET_SPEED;
		const y = Math.sin(rotation) * BULLET_SPEED;

		const velocity = [x, y];

		super(position, rotation, velocity, wireframe);

		this.epoch = Date.now();
	}

}
