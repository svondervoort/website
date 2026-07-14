export const updateCanvas = (canvas, pixelRatio = 1) => {
  const { width, height } = canvas.getBoundingClientRect();

  canvas.width = Math.max(1, Math.round(width / pixelRatio));
  canvas.height = Math.max(1, Math.round(height / pixelRatio));
};
