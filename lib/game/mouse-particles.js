import { getRandomInt, getRandomNonZeroFloat, isOutOfBounds } from "./helpers";

export const createMouseParticles = (coords, color) => {
  return Array.from({ length: getRandomInt(5, 20) }, () => ({
    x: coords.x,
    y: coords.y,
    color,
    sx: getRandomNonZeroFloat(),
    sy: getRandomNonZeroFloat(),
    size: getRandomInt(5, 10),
  }));
};

export const updateMouseParticles = (canvas, particles, gravity) => {
  return particles.filter((p) => {
    p.sy += gravity;
    p.x += p.sx;
    p.y += p.sy;

    return !isOutOfBounds(canvas, p);
  });
};

export const drawMouseParticles = (ctx, particles) => {
  particles.forEach((p) => {
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  });
};
