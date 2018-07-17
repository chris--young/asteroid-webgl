attribute vec2 a_vertex;

uniform vec2 u_position;

uniform float u_aspect_ratio;
uniform float u_rotation;
uniform float u_size;

mat3 scale(float s) {
	return mat3(
		vec3(  s, 0.0, 0.0),
		vec3(0.0,   s, 0.0),
		vec3(0.0, 0.0, 1.0)
	);
}

mat3 translate(float x, float y) {
	return mat3(
		vec3(1.0, 0.0,   x),
		vec3(0.0, 1.0,   y),
		vec3(0.0, 0.0, 1.0)
	);
}

mat3 rotate(float a) {
	float c = cos(a);
	float s = sin(a);

	return mat3(
		vec3(  c,  -s, 0.0),
		vec3(  s,   c, 0.0),
		vec3(0.0, 0.0, 1.0)
	);
}

void main() {
	vec3 position = vec3(a_vertex, 1.0) * scale(u_size) * rotate(u_rotation) * translate(u_position.x, u_position.y);

	gl_PointSize = 3.0;
	gl_Position = vec4(scale(u_aspect_ratio) * position, 1.0);
}
