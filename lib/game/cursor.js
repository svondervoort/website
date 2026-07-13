const radius = 8;
const grownRadius = 16;

export const drawCursor = (ctx, pointer, time) => {
  if (!pointer.active) return;

  ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(
    pointer.x,
    pointer.y,
    time < pointer.growUntil ? grownRadius : radius,
    0,
    Math.PI * 2
  );
  ctx.stroke();
};
