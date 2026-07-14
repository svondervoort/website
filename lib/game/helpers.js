export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomNonZeroFloat = (min = -2, max = 2, epsilon = 0.1) => {
  const half = Math.random() < 0.5;

  if (half) {
    return Math.random() * (-epsilon - min) + min;
  }

  return Math.random() * (max - epsilon) + epsilon;
};

export const isOutOfBounds = (canvas, { x, y, size }) => {
  return (
    x <= -size ||
    x >= canvas.width + size ||
    y <= -size ||
    y >= canvas.height + size
  );
};
