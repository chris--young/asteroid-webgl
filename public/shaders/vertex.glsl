attribute vec2 a_position;
attribute vec4 a_color;

varying vec4 v_color;
varying vec4 v_position;

uniform mat3 u_model;
uniform mat3 u_view;

void main() {
  gl_PointSize = 3.0;
  gl_Position = v_position = vec4(vec3(a_position.xy, 1) * u_model * u_view, 1);
  v_color = a_color;
}

