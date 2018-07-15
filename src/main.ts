import Alien from "./level/alien"
import Asteroid from "./level/asteroid"
import Bullet from "./level/bullet"
import Player from "./level/player"
import Audio from "./lib/audio"
import { fetch_shaders } from "./lib/network"
import Physics from "./lib/physics"
import Render from "./lib/render"
import wireframes from "./wireframes"

const BULLET_AGE = 2000;

(async function main(): Promise<void> {
	const shaders = await fetch_shaders();

	const render = new Render(shaders.vertex, shaders.fragment);
	const physics = new Physics(render.canvas.game);
	const audio = new Audio();

	audio.muted = true;

	const player = new Player(wireframes.player);
	// let alien = new Alien(wireframes.alien);

	let bodies = [];
	let paused = false;
	let pitch = 0;
	let blink = false;
	let blink_fast = false;

	bodies.push(player);

	// get rid of all these intervals
	// setInterval(() => {
	//   if (paused || !player.started || player.dead)
	//     return;

	//   alien.dead ? alien.dead = false : bodies.push(alien);
	// }, 10000);

	setInterval(() => paused || audio.beep(++pitch % 2 ? 440 : 220, 0.25), 2000);
	setInterval(() => blink = !blink, 1000);
	setInterval(() => blink_fast = !blink_fast, 250);

	for (let x = 0; x < 8; x++)
		bodies.push(new Asteroid(wireframes.asteroids, physics, 1));

	function loop(): void {
		render.clear();

		if (!player.started) {
			render._text(0, 0, "asteroids", "#eee", "bold 80px Hyperspace");

			if (blink)
				render._text(0, -0.1, "press space to start", "#eee", "bold 30px Hyperspace");
		} else {
			if (!player.lives && blink)
				render._text(0, 0, "game over", "#eee", "bold 60px Hyperspace");

			render._text(0, 0.9, `Lives ${player.lives}    Score ${player.score}`, "#eee", "18px Hyperspace");
		}

		if (!player.dead)
			physics.control(player);

		for (let index = 0; index < bodies.length; index++) {
			if (bodies[index].dead)
				continue;

			if (bodies[index] instanceof Bullet && Date.now() - bodies[index].epoch > BULLET_AGE)
				bodies[index].dead = true;

			for (let i = index + 1; i < bodies.length; i++) {
				if (bodies[i].dead)
					continue;

				// gross, use a body.collides_with bitmask then & to check
				if (((bodies[index] instanceof Asteroid && bodies[i] instanceof Player) ||
					(bodies[index] instanceof Player && bodies[i] instanceof Asteroid) ||
					(bodies[index] instanceof Asteroid && bodies[i] instanceof Bullet) ||
					(bodies[index] instanceof Bullet && bodies[i] instanceof Asteroid) ||
					(bodies[index] instanceof Alien && bodies[i] instanceof Bullet) ||
					(bodies[index] instanceof Bullet && bodies[i] instanceof Alien)) &&
					Physics.collision(bodies[index], bodies[i])) {

					if ((player.spawning || render.debug) && (bodies[index] instanceof Player || bodies[i] instanceof Player))
						continue;

					bodies[index].dead = true;
					bodies[i].dead = true;
					audio.pshh();

					if (bodies[index] instanceof Asteroid) {
						if (bodies[index].size > 0.25)
							bodies = bodies.concat(bodies[index].explode());

						++player.score;

						bodies.splice(index, 1);
					} else if (bodies[index] instanceof Bullet) {
						bodies.splice(index, 1);
					} else if (bodies[index] instanceof Player) {
						bodies[index].die();
					}
				}
			}

			if (!bodies[index].dead) {
				physics.update(bodies[index]);

				if (bodies[index] instanceof Player === false || !bodies[index].spawning || blink_fast)
					render.drawBody(bodies[index]);
			}
		}

		if (!paused)
			requestAnimationFrame(loop);
	}

	loop();

	document.addEventListener("keydown", (event: KeyboardEvent): void => {
		event.preventDefault();

		if (event.which === 192) {
			render.debug = !render.debug;
			return;
		} else if (event.which !== 32) {
			return;
		}

		const bullet = player.shoot(wireframes.bullet);

		if (bullet) {
			bodies.push(bullet);
			audio.pewpew();
		}
	});

	document.querySelector("#pause").addEventListener("click", (event: MouseEvent): void => {
		event.preventDefault();

		const target: HTMLAnchorElement = event.target as HTMLAnchorElement;

		if (!paused) {
			paused = true;
			target.innerText = "Resume";
		} else {
			paused = false;
			target.innerText = "Pause";
			loop();
		}
	});

	document.querySelector("#mute").addEventListener("click", (event: MouseEvent): void => {
		event.preventDefault();

		const target: HTMLAnchorElement = event.target as HTMLAnchorElement;

		if (!audio.muted) {
			audio.muted = true;
			target.innerText = "Unmute";
		} else {
			audio.muted = false;
			target.innerText = "Mute";
		}
	});

})();
