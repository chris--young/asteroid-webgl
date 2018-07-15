import Body from "../lib/body"
import Physics from "../lib/physics"
import Wireframe from "../lib/wireframe"

const ASTEROID_MAX_SPEED = 0.01;

export const flip = (): boolean => Math.random() < 0.5;
export const between = (min: number, max: number): number => Math.random() * (max - min + 1) + min;
export const random = (abs: number): number => flip() ? Math.random() * abs : Math.random() * -abs;

export default class Asteroid extends Body {

	position: number[];
	rotation: number;
	wireframe: Wireframe;
	velocity: number[];
	dead: boolean;
	size: number;
	explode: any;

	constructor(wireframes: Wireframe[], physics: Physics, size: number) {
		const i = between(0, wireframes.length - 1) | 0;

		let x = random(physics.aspect_ratio);
		let y = random(1);

		const position = [x, y];
		const rotation = 0;

		x = random(ASTEROID_MAX_SPEED);
		y = random(ASTEROID_MAX_SPEED);

		const velocity = [x, y];

		super(position, rotation, velocity, wireframes[i]);

		this.size = size;

		// doing this to get the closure around wireframes and physics, those should really just be globals or something
		this.explode = (): Asteroid[] => {
			const pieces = [];

			for (let x = 0; x < 3; ++x) {
				const piece = new Asteroid(wireframes, physics, this.size * 0.5);

				piece.position = [].concat(this.position); // avoid this?

				pieces.push(piece);
			}

			return pieces;
		};
	}

}
