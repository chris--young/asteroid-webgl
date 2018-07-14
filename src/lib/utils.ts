import LA from './la'

export const flatten = array => array.reduce((a, b) => a.concat(b));

export const flip = () => Math.random() < 0.5;
export const between = (min, max) => Math.random() * (max - min + 1) + min;
export const random = (abs) => flip() ? Math.random() * abs : Math.random() * -abs;

export function scale(x, y): number[][] {
  return LA.Matrix(Array)(3)([
    [x, 0, 0],
    [0, y, 0],
    [0, 0, 1]
  ]);
}

export function translate(x, y): number[][] {
  return LA.Matrix(Array)(3)([
    [1, 0, x],
    [0, 1, y],
    [0, 0, 1]
  ]);
}

export function rotate(r): number[][] {
  const c = Math.cos(r);
  const s = Math.sin(r);

  return LA.Matrix(Array)(3)([
    [c, -s,  0],
    [s,  c,  0],
    [0,  0,  1]
  ]);
}