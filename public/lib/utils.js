'use strict'

const flatten = array => array.reduce((a, b) => a.concat(b));

const flip = () => Math.random() < 0.5;
const between = (min, max) => Math.random() * (max - min + 1) + min;
const random = abs => flip() ? Math.random() * abs : Math.random() * -abs;

function scale(x, y) {
  return LA.Matrix(Array)(3)([
    [x, 0, 0],
    [0, y, 0],
    [0, 0, 1]
  ]);
}

function translate(x, y) {
  return LA.Matrix(Array)(3)([
    [1, 0, x],
    [0, 1, y],
    [0, 0, 1]
  ]);
}

function rotate(r) {
  const c = Math.cos(r);
  const s = Math.sin(r);

  return LA.Matrix(Array)(3)([
    [c, -s,  0],
    [s,  c,  0],
    [0,  0,  1]
  ]);
}
