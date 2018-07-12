attribute vec2 a_vertex;
attribute vec4 a_color;

varying vec4 v_color;

uniform mat3 u_model;
uniform mat3 u_view;
uniform float u_size;

void main() {
  v_color = a_color;

  gl_PointSize = 3.0;
  gl_Position = vec4(vec3(a_vertex, 1) * u_model * u_view, 1);
}
