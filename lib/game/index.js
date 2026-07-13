import { updateCanvas } from "./canvas";
import { initLetters, updateLetters, updateText, drawText } from "./text";
import { initEnemies, updateEnemies, drawEnemies } from "./enemies";
import { drawCursor } from "./cursor";

const colors = ["#E8E8E8", "#564256", "#96939b", "#bfbfbf", "#fc814a"];
const wordmark = "SANDERSOM";

export const createGame = (canvas) => {
  const ctx = canvas.getContext("2d");

  let frame = null;

  updateCanvas(canvas);

  let letters = initLetters(canvas, wordmark.split(""), colors);
  let enemies = initEnemies(canvas);
  let score = 0;
  const pointer = { x: 0, y: 0, active: false, growUntil: 0 };

  const handleResize = () => {
    updateCanvas(canvas);
    updateLetters(canvas, letters);
  };

  const toCanvasCoords = (event) => {
    const rect = canvas.getBoundingClientRect();

    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const handlePointerMove = (event) => {
    if (event.pointerType !== "mouse") return;

    const { x, y } = toCanvasCoords(event);

    pointer.x = x;
    pointer.y = y;
    pointer.active = true;
  };

  const handlePointerLeave = () => {
    pointer.active = false;
  };

  const loop = (time) => {
    updateText(canvas, letters, time);
    enemies = updateEnemies(canvas, enemies, score);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawText(ctx, letters);
    drawEnemies(ctx, enemies);
    drawCursor(ctx, pointer, time);

    frame = window.requestAnimationFrame(loop);
  };

  window.addEventListener("resize", handleResize);
  canvas.addEventListener("pointermove", handlePointerMove);
  canvas.addEventListener("pointerleave", handlePointerLeave);
  frame = window.requestAnimationFrame(loop);

  return {
    destroy() {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
    },
  };
};
