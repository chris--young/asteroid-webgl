import Body from "../lib/body"
import LA from "../lib/la"
import Physics from "../lib/physics"
import { between, random, scale } from "../lib/utils"
import Wireframe from "../lib/wireframe"

const ASTEROID_MAX_SPEED = 0.01;

export default class Asteroid implements Body {

	model: number[][];
	wireframe: Wireframe;
	velocity: number[];
	dead: boolean;
	size: number;
	explode: any;

	constructor(wireframes: Wireframe[], physics: Physics, size: number) {
		const i = between(0, wireframes.length - 1) | 0;

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

		this.model = model;
		this.velocity = velocity;
		this.wireframe = wireframes[i];
		this.dead = false;
		this.size = size;

		// doing this to get the closure around wireframes and physics, those should really just be globals or something
		this.explode = (): Asteroid[] => {
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
