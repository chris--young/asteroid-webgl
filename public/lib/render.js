'use strict'

class Render {
  constructor(scripts) {
    this.canvas = {
      game: document.querySelector('#game'),
      text: document.querySelector('#text')
    };

    this.gl = this.canvas.game.getContext('webgl', { antialias: false });
    this._2d = this.canvas.text.getContext('2d');
    this.debug = true;

    if (!this.gl || !this._2d)
      throw new Error('Unsupported browser');

    const shaders = [
      compile(this.gl, this.gl.VERTEX_SHADER, scripts.vertex),
      compile(this.gl, this.gl.FRAGMENT_SHADER, scripts.fragment)
    ];

    this.program = link(this.gl, shaders);
    this.gl.useProgram(this.program);
    this.gl.clearColor(0, 0, 0, 1);

    this.resize()
    this.canvas.game.addEventListener('webkitfullscreenchange', this.resize.bind(this));

    document.querySelector('#fullscreen').addEventListener('click', this.fullscreen.bind(this));
    document.querySelector('#debug').addEventListener('click', event => this.debug = event.target.checked);

    window.addEventListener('resize', this.resize.bind(this));
  }

  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this._2d.clearRect(0, 0, this.canvas.text.clientWidth, this.canvas.text.clientHeight);

    if (this.debug)
      this._grid();
  }

  _grid() {
    for (let y = -1; y < 1; y += 0.1)
      this.line(0, y, Math.PI, [0.25, 0.25, 0.25, 1]);

    for (let x = -this.ratio; x < this.ratio; x += 0.1)
      this.line(x, 0, Math.PI / 2, [0.25, 0.25, 0.25, 1]);
    
    this.polygon(0.01, 10, LA.Matrix(Array)(3)(LA.IDENTITY), [1, 1, 1, 1]);
  }

  draw(wireframe, model) {
    attribute(this.gl, this.program, 'a_position', wireframe.shape, 2);
    attribute(this.gl, this.program, 'a_color', wireframe.color, 4);

    uniform(this.gl, this.program, 'u_model', flatten(model));
    uniform(this.gl, this.program, 'u_view', flatten(this.aspectRatio));

    this.gl.drawArrays(this.gl.LINE_STRIP, 0, wireframe.shape.length / 2);
  }

  drawBody(body) {
    this.draw(body.wireframe, body.model);

    if (this.debug) {
      this.polygon(body.bounds, 8, body.model, [0, 1, 0, 1]);

      let px = body.model[0][2];
      let py = body.model[1][2];
      let vx = body.velocity[0];
      let vy = body.velocity[1];
      let rx = body.model[0][1];
      let ry = body.model[1][1];

      this._text(px + 0.1, py - 0.1, `b ${body.wireframe.bounds}`);
      this._text(px + 0.1, py - 0.2, `r ${Math.atan2(rx, ry).toFixed(3)}`);
      this._text(px + 0.1, py - 0.3, `p { x: ${px.toFixed(3)}, y: ${py.toFixed(3)} }`);
      this._text(px + 0.1, py - 0.4, `v { x: ${vx.toFixed(3)}, y: ${vy.toFixed(3)} }`);

      if (body.rotation)
        this._text(px + 0.1, py - 0.4, `r ${body.rotation.toFixed(2)}`);
    }
  }

  _text(x, y, string) {
    const w = this.canvas.text.clientWidth / 2;
    const h = this.canvas.text.clientHeight / 2;

    this._2d.save();
    this._2d.font = 'normal 16px Helvetica';
    this._2d.fillStyle = '#0f0';
    this._2d.translate(w, h);
    this._2d.fillText(string, x * w / this.ratio, y * -h);
    this._2d.restore();
  }

  line(x, y, angle, color) {
    const c = Math.cos(angle) * this.ratio;
    const s = Math.sin(angle);

    const wireframe = {
      shape: [-c, -s, c, s],
      color: color.concat(color)
    };

    this.draw(wireframe, translate(x, y));
  }

  polygon(radius, sides, model, color) {
    const wireframe = {
      shape: [],
      color: []
    };

    for (let r = 0; r <= Math.PI * 2; r += Math.PI * 2 / sides) {
      wireframe.shape.push(Math.cos(r) * radius);
      wireframe.shape.push(Math.sin(r) * radius);
      wireframe.color = wireframe.color.concat(color);
    }

    this.draw(wireframe, model);
  }

  resize() {
    this.canvas.game.width = this.canvas.text.width = document.body.clientWidth;
    this.canvas.game.height = this.canvas.text.height = document.body.clientHeight;

    this.gl.viewport(0, 0, this.canvas.game.clientWidth, this.canvas.game.clientHeight);

    this.ratio = this.canvas.game.clientWidth / this.canvas.game.clientHeight;
    this.aspectRatio = scale(1 / (this.ratio), 1);
  }

  fullscreen() {
    this.canvas.game.webkitRequestFullScreen();
  }
}

function compile(gl, type, source) {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);

    gl.deleteShader(shader);

    throw new Error(`Failed to compile shader: ${info}`);
  }

  return shader;
}

function link(gl, shaders) {
  const program = gl.createProgram();

  shaders.forEach(shader => gl.attachShader(program, shader));
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);

    gl.deleteProgram(program);

    throw new Error(`Failed to link program: ${info}`);
  }

  return program;
}

function attribute(gl, program, key, value, size) {
  const buffer = gl.createBuffer(); 
  const location = gl.getAttribLocation(program, key);

  if (!~location)
    throw new Error(`Failed to get attribute location "${key}"`);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(value), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
}

function uniform(gl, program, key, value) {
  const location = gl.getUniformLocation(program, key);

  if (!location)
    throw new Error(`Failed to get uniform location "${key}"`);

  gl.uniformMatrix3fv(location, false, new Float32Array(value));
}

