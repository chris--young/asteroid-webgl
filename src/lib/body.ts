import Wireframe from "./wireframe"

// use an abstract class instead?
export default abstract class Body {

	position: number[];
	rotation: number;
	velocity: number[];
	wireframe: Wireframe;
	dead: boolean;
	size: number;

	constructor(position: number[], rotation: number, velocity: number[], wireframe: Wireframe) {
		this.position = [].concat(position); // avoid this?
		this.rotation = rotation;
		this.velocity = [].concat(velocity);
		this.wireframe = wireframe;
		this.dead = false;
		this.size = 1;
	}

}
