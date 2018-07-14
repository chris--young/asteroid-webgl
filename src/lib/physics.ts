import Player from "../level/player"
import Body from "./body"
import LA from "./la"
import { rotate, translate } from "./utils"

const _360 = Math.PI * 2;
const SPEED = 0.01;
const ROTATION = _360 / 360 * 5;
const DRAG = 0.99;
const MIN = 0.001;
const RIGHT_ARROW = 37;
const LEFT_ARROW = 39;
const UP_ARROW = 38;
const SPACE_BAR = 91;

export default class Physics {

	canvas: HTMLCanvasElement;
	input: object;
	width: number;
	height: number;
	ratio: number;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.input = { timestamp: Date.now() };

		this.resize();

		document.addEventListener("keydown", (event: KeyboardEvent) => this.input[event.which] = true);
		document.addEventListener("keyup", (event: KeyboardEvent) => this.input[event.which] = false);

		window.addEventListener("resize", this.resize.bind(this));
	}

	resize(): void {
		this.width = this.canvas.clientWidth;
		this.height = this.canvas.clientHeight;
		this.ratio = this.width / this.height;
	}

	// why would you even do this? just use euler angles
	update(body: Body): void {
		if (body instanceof Player)
			friction(body);

		body.model = LA.multiply(translate(body.velocity[0], body.velocity[1]), body.model);

		if (body.model[1][2] - body.wireframe.bounds > 1)
			body.model = LA.multiply(translate(0, -2 - body.wireframe.bounds), body.model);
		else if (body.model[1][2] + body.wireframe.bounds < -1)
			body.model = LA.multiply(translate(0, 2 + body.wireframe.bounds), body.model);

		if (body.model[0][2] - body.wireframe.bounds > this.ratio)
			body.model = LA.multiply(translate(-this.ratio * 2 - body.wireframe.bounds, 0), body.model);
		else if (body.model[0][2] + body.wireframe.bounds < -this.ratio)
			body.model = LA.multiply(translate(this.ratio * 2 + body.wireframe.bounds, 0), body.model);
	}

	control(body: Body): void {
		if (this.input[RIGHT_ARROW])
			body.model = LA.multiply(body.model, rotate(ROTATION));

		if (this.input[LEFT_ARROW])
			body.model = LA.multiply(body.model, rotate(-ROTATION));

		if (this.input[UP_ARROW]) {
			const a = Math.atan2(body.model[1][0], body.model[1][1]);
			const x = Math.cos(a) * SPEED;
			const y = Math.sin(a) * SPEED;

			body.velocity = LA.Vector(Array)(3)([x, y, 0]);
		}
	}

	static collision(body1: Body, body2: Body): boolean {
		const a = body1.model[0][2] - body2.model[0][2];
		const b = body1.model[1][2] - body2.model[1][2];

		const distance = Math.sqrt(Math.pow(a, 2) +  Math.pow(b, 2));
		const bounds = body1.wireframe.bounds * body1.size + body2.wireframe.bounds * body2.size;

		if (distance > bounds)
			return false;

		const x1 = body1.velocity[0];
		const y1 = body1.velocity[1];

		const x2 = body2.velocity[0];
		const y2 = body2.velocity[1];

		body1.velocity[0] = x2;
		body1.velocity[1] = y2;

		body2.velocity[0] = x1;
		body2.velocity[1] = y1;

		return true;
	}

}

function friction(body: Body): void {
	const x = Math.abs(body.velocity[0]);
	const y = Math.abs(body.velocity[1]);

	if (x > 0 || y > 0)
		body.velocity = LA.scale(body.velocity, DRAG);

	if (x < MIN)
		body.velocity[0] = 0;

	if (y < MIN)
		body.velocity[1] = 0;
}
