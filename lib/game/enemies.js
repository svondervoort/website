import { getRandomNonZeroFloat, isOutOfBounds } from "./helpers";

const enemyColor = "#fc814a";
const enemySize = 64;
const minEnemies = 5;

const randomness = 0.3;
const randomnessScoreScaling = 0.02;

const maxSpeed = 3;
const speedScoreScaling = 0.01;

const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value));

const createEnemy = (canvas) => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  color: enemyColor,
  sx: getRandomNonZeroFloat(),
  sy: getRandomNonZeroFloat(),
  size: enemySize,
});

export const initEnemies = (canvas) => {
  return Array.from({ length: minEnemies }, () => createEnemy(canvas));
};

export const updateEnemies = (canvas, enemies, score) => {
  const dynamicRandomness = randomness + score * randomnessScoreScaling;
  const dynamicMaxSpeed = maxSpeed + score * speedScoreScaling;

  const alive = enemies.filter((e) => {
    e.sx = clamp(e.sx + (Math.random() - 0.5) * dynamicRandomness, dynamicMaxSpeed);
    e.sy = clamp(e.sy + (Math.random() - 0.5) * dynamicRandomness, dynamicMaxSpeed);

    e.x += e.sx;
    e.y += e.sy;

    return !isOutOfBounds(canvas, e);
  });

  while (alive.length < minEnemies) {
    alive.push(createEnemy(canvas));
  }

  return alive;
};

export const drawEnemies = (ctx, enemies) => {
  enemies.forEach((e) => {
    ctx.fillStyle = e.color;
    ctx.fillRect(e.x, e.y, e.size, e.size);
  });
};

export const hitEnemies = (enemies, coords) => {
  let hit = false;

  const remaining = enemies.filter((e) => {
    const isHit =
      coords.x >= e.x &&
      coords.x <= e.x + e.size &&
      coords.y >= e.y &&
      coords.y <= e.y + e.size;

    if (isHit) hit = true;

    return !isHit;
  });

  return { enemies: remaining, hit };
};
