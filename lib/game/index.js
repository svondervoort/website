import { updateCanvas } from "./canvas";
import { initLetters, updateLetters, updateText, drawText } from "./text";
import { initEnemies, updateEnemies, drawEnemies, hitEnemies } from "./enemies";
import {
  initPortrait,
  updatePortrait,
  updateReveal,
  drawPortrait,
} from "./portrait";
import { drawCursor } from "./cursor";
import {
  createMouseParticles,
  updateMouseParticles,
  drawMouseParticles,
} from "./mouse-particles";

const colors = ["#E8E8E8", "#564256", "#96939b", "#bfbfbf", "#fc814a"];
const wordmark = "SANDERSOM";
const winMark = "YOU WIN";
const winScore = 25;
const gravity = 0.025;
const cursorGrowDuration = 200;

export const createGame = (canvas) => {
  const ctx = canvas.getContext("2d");

  let frame = null;
  let lastTime = null;
  let elapsed = 0;

  updateCanvas(canvas);

  let letters = initLetters(canvas, wordmark.split(""), colors);
  let enemies = initEnemies(canvas);
  let particles = [];
  let score = 0;
  let won = false;
  const portrait = initPortrait(canvas);
  const pointer = { x: 0, y: 0, active: false, growUntil: 0 };

  const handleResize = () => {
    updateCanvas(canvas);
    updateLetters(canvas, letters);
    updatePortrait(canvas, portrait);
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

  const handlePointerDown = (event) => {
    const coords = toCanvasCoords(event);

    if (event.pointerType === "mouse") {
      pointer.x = coords.x;
      pointer.y = coords.y;
      pointer.active = true;
      pointer.growUntil = performance.now() + cursorGrowDuration;
    }

    if (won) return;

    const result = hitEnemies(enemies, coords);
    enemies = result.enemies;

    if (!result.hit) return;

    particles = particles.concat(createMouseParticles(coords, colors));
    score += 1;
    won = score >= winScore;

    // Won, so the board is cleared: the enemies would otherwise sit on top of the
    // photograph they just uncovered. The loop keeps running, which is what lets the
    // reveal finish easing in behind the message.
    if (won) enemies = [];

    letters = initLetters(
      canvas,
      (won ? winMark : `SCORE: ${score}`).split(""),
      colors
    );
  };

  const loop = (time) => {
    // The wave runs on accumulated elapsed time, not the raw timestamp, so it does
    // not snap to a new phase after the loop has been paused. The cursor's grow
    // deadline is on the raw clock (performance.now), so it gets `time` as-is.
    elapsed += lastTime === null ? 0 : time - lastTime;
    lastTime = time;

    updateText(canvas, letters, elapsed);
    if (!won) enemies = updateEnemies(canvas, enemies, score);
    particles = updateMouseParticles(canvas, particles, gravity);
    updateReveal(portrait, score, winScore);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPortrait(ctx, portrait);
    drawText(ctx, letters);
    drawEnemies(ctx, enemies);
    drawMouseParticles(ctx, particles);
    drawCursor(ctx, pointer, time);

    frame = window.requestAnimationFrame(loop);
  };

  const start = () => {
    if (frame !== null) return;

    lastTime = null;
    frame = window.requestAnimationFrame(loop);
  };

  const stop = () => {
    if (frame === null) return;

    window.cancelAnimationFrame(frame);
    frame = null;
  };

  canvas.classList.add("is-playing");

  window.addEventListener("resize", handleResize);
  canvas.addEventListener("pointermove", handlePointerMove);
  canvas.addEventListener("pointerleave", handlePointerLeave);
  canvas.addEventListener("pointerdown", handlePointerDown);

  let observer = null;

  if (typeof IntersectionObserver === "undefined") {
    start();
  } else {
    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });

    observer.observe(canvas);
  }

  return {
    destroy() {
      stop();

      if (observer !== null) {
        observer.disconnect();
      }

      canvas.classList.remove("is-playing");

      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      canvas.removeEventListener("pointerdown", handlePointerDown);
    },
  };
};
