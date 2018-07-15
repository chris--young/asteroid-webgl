import Body from "../lib/body"
import Wireframe from "../lib/wireframe"

export default class Alien extends Body {

	position: number[];
	rotation: number;
	velocity: number[];
	wireframe: Wireframe;
	dead: boolean;
	size: number;

	constructor(wireframe: Wireframe) {
		const position = [0, 0.5];
		const rotation = 0;
		const velocity = [0, 0];

		super(position, rotation, velocity, wireframe);
	}

}
