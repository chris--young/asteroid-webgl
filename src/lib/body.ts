import Wireframe from "./wireframe"

// use an abstract class instead?
export default interface Body {
	model: number[][];
	velocity: number[];
	wireframe: Wireframe;
	dead: boolean;
	size: number;
}
