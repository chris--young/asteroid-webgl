import Body from "../lib/body"
import LA from "../lib/la"
import { rotate } from "../lib/utils"
import Wireframe from "../lib/wireframe"
import Bullet from "./bullet"

export default class Player implements Body {

	model: number[][];
	velocity: number[];
	wireframe: Wireframe;
	lives: number;
	score: number;
	started: boolean;
	dead: boolean;
	spawning: boolean;
	size: number;

	constructor(wireframe: Wireframe) {
		const model = rotate(Math.PI / 2);
		const velocity = LA.Vector(Array)(2)();

		this.model = model;
		this.velocity = velocity;
		this.wireframe = wireframe;
		this.lives = 3;
		this.score = 0;
		this.started = false;
		this.dead = true;
		this.spawning = false;
		this.size = 1;
	}

	shoot(wireframe: Wireframe): Bullet {
		if (!this.started) {
			this.started = true;
			this.dead = false;
			this.spawning = true;
			setTimeout(() => this.spawning = false, 2000);
			return;
		}

		if (this.dead)
			return;

		const model = LA.Matrix(Array)(3)(this.model);

		return new Bullet(model, wireframe);
	}

	die(): void {
		if (this.spawning || !this.started)
		return;

		if (--this.lives <= 0)
		return;

		setTimeout(this.respawn.bind(this), 1500);
	}

	respawn(): void {
		this.model = rotate(Math.PI / 2);
		this.velocity = LA.Vector(Array)(2)();
		this.dead = false;
		this.spawning = true;

		setTimeout(() => this.spawning = false, 2000);
	}

}
