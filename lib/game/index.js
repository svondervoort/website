import { updateCanvas } from "./canvas";
import { initLetters, updateLetters, updateText, drawText } from "./text";

const colors = ["#E8E8E8", "#564256", "#96939b", "#bfbfbf", "#fc814a"];
const wordmark = "SANDERSOM";

export const createGame = (canvas) => {
  const ctx = canvas.getContext("2d");

  let frame = null;

  updateCanvas(canvas);

  let letters = initLetters(canvas, wordmark.split(""), colors);

  const handleResize = () => {
    updateCanvas(canvas);
    updateLetters(canvas, letters);
  };

  const loop = (time) => {
    updateText(canvas, letters, time);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawText(ctx, letters);

    frame = window.requestAnimationFrame(loop);
  };

  window.addEventListener("resize", handleResize);
  frame = window.requestAnimationFrame(loop);

  return {
    destroy() {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("resize", handleResize);
    },
  };
};
