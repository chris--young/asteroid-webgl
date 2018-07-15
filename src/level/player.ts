import Body from "../lib/body"
import Wireframe from "../lib/wireframe"
import Bullet from "./bullet"

export default class Player extends Body {

	position: number[];
	rotation: number;
	velocity: number[];
	wireframe: Wireframe;
	lives: number;
	score: number;
	started: boolean;
	dead: boolean;
	spawning: boolean;
	size: number;

	constructor(wireframe: Wireframe) {
		const position = [0, 0];
		const rotation = Math.PI / 2;
		const velocity = [0, 0];

		super(position, rotation, velocity, wireframe);

		this.lives = 3;
		this.score = 0;
		this.started = false;
		this.dead = true;
		this.spawning = false;
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

		return new Bullet(this.position, this.rotation, wireframe);
	}

	die(): void {
		if (this.spawning || !this.started)
			return;

		if (--this.lives <= 0)
			return;

		setTimeout(this.respawn.bind(this), 1500);
	}

	respawn(): void {
		this.position = [0, 0];
		this.rotation = Math.PI / 2;
		this.velocity = [0, 0];
		this.dead = false;
		this.spawning = true;

		setTimeout(() => this.spawning = false, 2000);
	}

}
