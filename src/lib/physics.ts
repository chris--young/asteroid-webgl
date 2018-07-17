import Player from "../level/player"
import Body from "./body"

const _360 = Math.PI * 2;
const SPEED = 0.01;
const ROTATION = _360 / 360 * 5;
const DRAG = 0.99;
const MIN = 0.001;
const RIGHT_ARROW = 37;
const LEFT_ARROW = 39;
const UP_ARROW = 38;

function friction(body: Body): void {
	const x = Math.abs(body.velocity[0]);
	const y = Math.abs(body.velocity[1]);

	if (x > 0 || y > 0) {
		body.velocity[0] *= DRAG;
		body.velocity[1] *= DRAG;
	}

	if (x < MIN)
		body.velocity[0] = 0;

	if (y < MIN)
		body.velocity[1] = 0;
}

export default class Physics {

	canvas: HTMLCanvasElement;
	input: object;
	width: number;
	height: number;
	aspect_ratio: number;

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
		this.aspect_ratio = this.width / this.height;
	}

	update(body: Body): void {
		if (body instanceof Player)
			friction(body);

		body.position[0] += body.velocity[0];
		body.position[1] += body.velocity[1];

		if (body.position[1] - body.wireframe.bounds > 1)
			body.position[1] -= 2 + body.wireframe.bounds;
		else if (body.position[1] + body.wireframe.bounds < -1)
			body.position[1] += 2 + body.wireframe.bounds;

		if (body.position[0] - body.wireframe.bounds > this.aspect_ratio)
			body.position[0] -= this.aspect_ratio * 2 + body.wireframe.bounds;
		else if (body.position[0] + body.wireframe.bounds < -this.aspect_ratio)
			body.position[0] += this.aspect_ratio * 2 + body.wireframe.bounds;
	}

	control(body: Body): void {
		if (this.input[RIGHT_ARROW])
			body.rotation += ROTATION;

		if (this.input[LEFT_ARROW])
			body.rotation -= ROTATION;

		if (this.input[UP_ARROW]) {
			const x = Math.cos(body.rotation) * SPEED;
			const y = Math.sin(body.rotation) * SPEED;

			body.velocity = [x, y, 0];
		}
	}

	static collision(body1: Body, body2: Body): boolean {
		const a = body1.position[0] - body2.position[0];
		const b = body1.position[1] - body2.position[1];

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
