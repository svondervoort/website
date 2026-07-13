# Canvas Game Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static `SANDERSOM` block on the homepage with the interactive canvas game ported from `../svondervoort-landing`, rendered full-bleed at 100vh with the site's vertical timeline line running over it.

**Architecture:** The game is a framework-agnostic module set under `lib/game/`. A single entry point, `createGame(canvas)`, owns all mutable state in a closure (letters, enemies, particles, score, pointer), wires listeners to the canvas element, runs the `requestAnimationFrame` loop, and returns a `destroy()`. A thin React component `components/game.js` holds the canvas ref and calls `createGame` / `destroy` from a `useEffect`. React never re-renders per frame.

**Tech Stack:** Next 12 (pages router), React 18, Tailwind 3, plain Canvas 2D. No new dependencies.

## Global Constraints

- No new npm dependencies. No test framework — every task is verified by `yarn build` passing plus a browser check of `yarn dev` at http://localhost:3000.
- All game modules are plain ES modules under `lib/game/`. They must not import React and must not read globals: no bare `canvas`, no `window.innerWidth` / `window.innerHeight` for game bounds. The canvas is always passed in as a parameter, and its bounds are `canvas.width` / `canvas.height`.
- No module-level mutable state in `lib/game/`. State lives in the `createGame` closure. (React 18 StrictMode mounts effects twice in dev; module state would double.)
- Listeners bind to the canvas element, never to `document`.
- No handler calls `preventDefault` — vertical drag must still scroll the page on touch.
- Wordmark text is `SANDERSOM` (the landing's `SANDEROM` is missing an S).
- Enemy colour is exactly `#fc814a`. Letter palette is exactly `["#E8E8E8", "#564256", "#96939b", "#bfbfbf", "#fc814a"]`.
- Canvas background stays transparent — the page's green gradient shows through. Never fill the canvas.
- Prettier is configured (`prettier-plugin-tailwindcss`). Match the existing code style: double-quoted strings, semicolons, 2-space indent.

## File Structure

| File | Responsibility |
| --- | --- |
| `lib/game/helpers.js` | Pure maths: random int, random non-zero float, out-of-bounds test |
| `lib/game/canvas.js` | Size the canvas drawing buffer to its rendered box |
| `lib/game/text.js` | Wavy wordmark letters: init, reflow, animate, draw |
| `lib/game/enemies.js` | Drifting squares: init, update + respawn, draw, hit test |
| `lib/game/mouse-particles.js` | Click burst particles: create, update, draw |
| `lib/game/cursor.js` | Draw the ring cursor (mouse only) |
| `lib/game/index.js` | `createGame(canvas)` — owns state, listeners, rAF loop, `destroy()` |
| `components/game.js` | React wrapper: canvas ref + mount/unmount |
| `pages/index.js` | Remove the `aspect-square` / `<h1>` block, mount `<Game />` |
| `pages/_document.js` | Load the Bytesized font |
| `styles/globals.css` | `cursor: none` on fine pointers, clip horizontal overflow |
| `pages/_app.js` | Import `globals.css` (currently never imported) |

---

### Task 1: Full-bleed canvas with the wavy wordmark

The end state of this task: a 100vh full-bleed canvas where the page's `SANDERSOM` headline used to be, showing the letters waving in Bytesized, with the white vertical timeline line running down over the top of it.

**Files:**
- Create: `lib/game/helpers.js`
- Create: `lib/game/canvas.js`
- Create: `lib/game/text.js`
- Create: `lib/game/index.js`
- Create: `components/game.js`
- Modify: `pages/index.js:93-104`
- Modify: `pages/_document.js:10-13`
- Modify: `pages/_app.js:1-3`
- Modify: `styles/globals.css` (currently empty)

**Interfaces:**
- Produces:
  - `getRandomInt(min, max) => number`
  - `getRandomNonZeroFloat(min = -2, max = 2, epsilon = 0.1) => number`
  - `isOutOfBounds(canvas, item) => boolean` — `item` is `{ x, y, size }`
  - `updateCanvas(canvas, pixelRatio = 1) => void`
  - `initLetters(canvas, text, colors) => letter[]` — `text` is an array of single characters; `letter` is `{ letter, x, y, color }`
  - `updateLetters(canvas, letters) => void` — reflows x/y in place after a resize
  - `updateText(canvas, letters, time) => void` — `time` is the rAF timestamp in ms
  - `drawText(ctx, letters) => void`
  - `createGame(canvas) => { destroy() }`
  - `<Game />` — default export of `components/game.js`

- [ ] **Step 1: Create `lib/game/helpers.js`**

```js
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
```

- [ ] **Step 2: Create `lib/game/canvas.js`**

The drawing buffer is sized from the canvas's *rendered box*, not the viewport. The landing could use `window.innerWidth` because its canvas was the whole page; ours is a 100vh section inside a scrolling document.

```js
export const updateCanvas = (canvas, pixelRatio = 1) => {
  const { width, height } = canvas.getBoundingClientRect();

  canvas.width = Math.max(1, Math.round(width / pixelRatio));
  canvas.height = Math.max(1, Math.round(height / pixelRatio));
};
```

- [ ] **Step 3: Create `lib/game/text.js`**

Note what changed from the landing: every export now takes `canvas` as its first argument. The original read a bare `canvas` global that only existed because `<canvas id="canvas">` auto-creates `window.canvas`. A ref'd canvas creates no such global. `updateText` also takes the rAF `time` instead of calling `Date.now()`.

```js
const fontFamily = '"Bytesized"';

const letterSize = 96;
const letterWidth = 64;

const waveSpeed = 0.003;
const waveAmplitude = 16;
const waveFrequency = 1;

const letterX = (canvas, count, index) => {
  return (canvas.width - count * letterWidth) / 2 + index * letterWidth;
};

export const initLetters = (canvas, text, colors) => {
  return text.map((letter, i) => ({
    letter,
    x: letterX(canvas, text.length, i),
    y: canvas.height / 2,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
};

export const updateLetters = (canvas, letters) => {
  letters.forEach((l, i) => {
    l.x = letterX(canvas, letters.length, i);
    l.y = canvas.height / 2;
  });
};

export const updateText = (canvas, letters, time) => {
  const wave = time * waveSpeed;

  letters.forEach((l, i) => {
    l.y = canvas.height / 2 + Math.sin(wave + i * waveFrequency) * waveAmplitude;
  });
};

export const drawText = (ctx, letters) => {
  ctx.font = `${letterSize}px ${fontFamily}`;

  letters.forEach((l) => {
    ctx.fillStyle = l.color;
    ctx.fillText(l.letter, l.x, l.y);
  });
};
```

- [ ] **Step 4: Create `lib/game/index.js`**

Enemies, particles and the cursor arrive in later tasks. This is the loop and the teardown. Note the loop stores its frame id — the landing declared `function requestAnimationFrame()`, shadowing the global and making cancellation impossible.

```js
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
```

- [ ] **Step 5: Create `components/game.js`**

The first paint waits on `document.fonts.ready`, otherwise the letters flash in a fallback face before Bytesized loads. `cancelled` guards the case where the component unmounts while the font promise is still pending.

```js
import { useEffect, useRef } from "react";

import { createGame } from "../lib/game";

export default function Game() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    let game = null;
    let cancelled = false;

    const start = () => {
      if (cancelled) return;
      game = createGame(canvas);
    };

    if (document.fonts) {
      document.fonts.ready.then(start);
    } else {
      start();
    }

    return () => {
      cancelled = true;
      if (game) game.destroy();
    };
  }, []);

  return (
    <div className="relative -ml-16 h-[calc(100vh-8rem)] lg:-ml-24 lg:h-[calc(100vh-12rem)]">
      <canvas
        ref={canvasRef}
        className="game-canvas absolute left-1/2 top-0 h-full w-screen -translate-x-1/2"
      />
    </div>
  );
}
```

The wrapper's negative left margin cancels the container's `pl-16 lg:pl-24`. Without it the
canvas's containing block is the *padded* box, so `left-1/2` centres the canvas on that box
rather than on the viewport — the wordmark ends up half the padding (48px at `lg`) right of
centre and the canvas overhangs the right edge.

The height is the viewport minus the page's top offset (`main`'s `pt-24 lg:pt-32` plus the
container's `py-8 lg:py-16` — 8rem, and 12rem at `lg`), so the hero fills exactly the visible
screen. A literal `h-screen` would start 192px down and run past the fold.

- [ ] **Step 6: Load the Bytesized font in `pages/_document.js`**

Replace the existing `<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Major+Mono+Display&display=swap" rel="stylesheet" />` with:

```jsx
        <link
          href="https://fonts.googleapis.com/css2?family=Bytesized&family=JetBrains+Mono:wght@400;700&family=Major+Mono+Display&display=swap"
          rel="stylesheet"
        />
```

- [ ] **Step 7: Write `styles/globals.css`**

The file exists but is empty and is never imported. Body overflow is clipped so the canvas's `w-screen` breakout cannot create a horizontal scrollbar. `cursor: none` is scoped to fine pointers so touch devices are unaffected.

```css
body {
  overflow-x: hidden;
}

@media (pointer: fine) {
  .game-canvas {
    cursor: none;
  }
}
```

- [ ] **Step 8: Import `globals.css` in `pages/_app.js`**

Add the import directly below the three Tailwind imports, so its rules win over Tailwind's:

```js
import "tailwindcss/base.css";
import "tailwindcss/components.css";
import "tailwindcss/utilities.css";
import "../styles/globals.css";
```

- [ ] **Step 9: Mount `<Game />` in `pages/index.js`**

Add the import beside the existing ones at the top of the file:

```js
import Game from "../components/game";
```

Then replace the container's opening tag and the entire `aspect-square` block (`pages/index.js:93-104`) with the following. The `before:` line gains `before:z-10` so it paints above the canvas and `before:pointer-events-none` so it does not swallow clicks meant for the game. The `<h1>` survives as screen-reader-only text — the visible wordmark is now drawn by the canvas.

```jsx
      <div className="relative container mx-auto md:max-w-3xl py-8 lg:py-16 pl-16 lg:pl-24 before:absolute before:bottom-0 before:top-0 before:left-4 before:z-10 before:w-0.5 before:bg-white/50 before:pointer-events-none">
        <h1 className="sr-only">SANDERSOM</h1>

        <Game />

        <div className="mt-12 font-mono text-sm text-white md:text-base lg:mt-16">
```

Leave the intro paragraphs and everything below them untouched.

- [ ] **Step 10: Verify the build passes**

Run: `yarn build`
Expected: `Compiled successfully` and a static `/` route in the summary. No ESLint errors.

- [ ] **Step 11: Verify in the browser**

Run `yarn dev` and open http://localhost:3000.

Expected:
- A full viewport-width, viewport-height area where the bordered `SANDERSOM` box used to be.
- The letters `SANDERSOM` centred, drawn in the pixel-ish Bytesized face, each letter a different colour from the palette, bobbing in a sine wave.
- The white vertical line runs from the top of the hero all the way down into the timeline, drawn *over* the canvas area.
- No horizontal scrollbar at any width. Resize the window: the letters recentre.
- The green gradient shows through the canvas — it is not a dark box.

- [ ] **Step 12: Commit**

```bash
git add lib/game components/game.js pages/index.js pages/_app.js pages/_document.js styles/globals.css
git commit -m "Replaced the SANDERSOM headline with a full-bleed canvas wordmark"
```

---

### Task 2: Drifting enemies

**Files:**
- Create: `lib/game/enemies.js`
- Modify: `lib/game/index.js`

**Interfaces:**
- Consumes: `getRandomNonZeroFloat`, `isOutOfBounds` from `lib/game/helpers.js`
- Produces:
  - `initEnemies(canvas) => enemy[]` — `enemy` is `{ x, y, color, sx, sy, size }`
  - `updateEnemies(canvas, enemies, score) => enemy[]` — returns a **new** array: culls out-of-bounds enemies and refills to the minimum
  - `drawEnemies(ctx, enemies) => void`
  - `hitEnemies(enemies, coords) => { enemies, hit }` — used in Task 4

- [ ] **Step 1: Create `lib/game/enemies.js`**

Two changes from the landing worth understanding. First, `updateEnemies` returns a new array instead of `splice`-ing during a `forEach` — mutating an array while iterating it skips the element after every removal, so the original silently failed to cull some enemies. Second, spawn positions and bounds use `canvas.width` / `canvas.height` rather than `window.innerWidth` / `window.innerHeight`.

```js
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
```

- [ ] **Step 2: Wire enemies into `lib/game/index.js`**

Add the import below the existing `text` import:

```js
import { initEnemies, updateEnemies, drawEnemies } from "./enemies";
```

Declare `score` and `enemies` beside `letters`:

```js
  let letters = initLetters(canvas, wordmark.split(""), colors);
  let enemies = initEnemies(canvas);
  let score = 0;
```

And extend the loop — enemies are drawn *over* the text, matching the landing's draw order:

```js
  const loop = (time) => {
    updateText(canvas, letters, time);
    enemies = updateEnemies(canvas, enemies, score);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawText(ctx, letters);
    drawEnemies(ctx, enemies);

    frame = window.requestAnimationFrame(loop);
  };
```

ESLint will not complain that `score` is never reassigned — it is a `let` read by `updateEnemies`, and Task 4 writes to it.

- [ ] **Step 3: Verify the build passes**

Run: `yarn build`
Expected: `Compiled successfully`, no ESLint errors.

- [ ] **Step 4: Verify in the browser**

Run `yarn dev` and open http://localhost:3000.

Expected:
- Five orange (`#fc814a`) 64px squares drifting around the hero with a wandering, slightly random motion.
- When one drifts off an edge it disappears and a new one appears somewhere else — the count stays at five. Watch for ~30 seconds to see this happen.
- The squares are drawn over the wavy letters.

- [ ] **Step 5: Commit**

```bash
git add lib/game
git commit -m "Added the drifting enemies to the canvas hero"
```

---

### Task 3: Pointer tracking and the drawn cursor

**Files:**
- Create: `lib/game/cursor.js`
- Modify: `lib/game/index.js`

**Interfaces:**
- Produces:
  - `drawCursor(ctx, pointer, time) => void` — `pointer` is `{ x, y, active, growUntil }`; draws nothing when `active` is false
  - In `index.js`: `toCanvasCoords(event) => { x, y }`, and the `pointer` object shared with Task 4

- [ ] **Step 1: Create `lib/game/cursor.js`**

The landing kept `growCursor` in a module-level variable driven by a `setTimeout`. Here the grow state is a timestamp on the `pointer` object, compared against the rAF clock — no timer to leak on unmount. `active` is false until a real mouse has moved, so touch devices never get a stray ring.

```js
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
```

- [ ] **Step 2: Wire the pointer into `lib/game/index.js`**

Add the import:

```js
import { drawCursor } from "./cursor";
```

Add the pointer state beside `score`:

```js
  const pointer = { x: 0, y: 0, active: false, growUntil: 0 };
```

Add the coordinate mapper and the two handlers above `loop`. `getBoundingClientRect` is essential: the canvas is not at viewport `0,0` — the page scrolls, and the canvas's drawing buffer may differ from its CSS size.

```js
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
```

Draw the cursor last, on top of everything:

```js
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawText(ctx, letters);
    drawEnemies(ctx, enemies);
    drawCursor(ctx, pointer, time);
```

Register both listeners on the **canvas** — not `document`, which is what the landing did and which would have made clicks on the filter checkboxes count as game input:

```js
  window.addEventListener("resize", handleResize);
  canvas.addEventListener("pointermove", handlePointerMove);
  canvas.addEventListener("pointerleave", handlePointerLeave);
```

And remove them in `destroy()`:

```js
    destroy() {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
    },
```

- [ ] **Step 3: Verify the build passes**

Run: `yarn build`
Expected: `Compiled successfully`, no ESLint errors.

- [ ] **Step 4: Verify in the browser**

Run `yarn dev` and open http://localhost:3000.

Expected:
- Moving the mouse over the hero hides the system cursor and draws a white ring that tracks it exactly — including after scrolling the page part-way down, which is what proves the `getBoundingClientRect` mapping is right.
- Moving the mouse off the canvas restores the normal cursor and the ring disappears.
- Over the intro text and the timeline, the normal cursor is back.

- [ ] **Step 5: Commit**

```bash
git add lib/game
git commit -m "Added the drawn ring cursor to the canvas hero"
```

---

### Task 4: Popping enemies — particles and score

**Files:**
- Create: `lib/game/mouse-particles.js`
- Modify: `lib/game/index.js`

**Interfaces:**
- Consumes: `getRandomInt`, `getRandomNonZeroFloat`, `isOutOfBounds` from `lib/game/helpers.js`; `hitEnemies` from `lib/game/enemies.js`; `initLetters` from `lib/game/text.js`
- Produces:
  - `createMouseParticles(coords, colors) => particle[]` — `particle` is `{ x, y, color, sx, sy, size }`
  - `updateMouseParticles(canvas, particles, gravity) => particle[]` — returns a new array with out-of-bounds particles culled
  - `drawMouseParticles(ctx, particles) => void`

- [ ] **Step 1: Create `lib/game/mouse-particles.js`**

As with enemies, the update returns a new array rather than `splice`-ing mid-`forEach`, and bounds come from the canvas.

```js
import { getRandomInt, getRandomNonZeroFloat, isOutOfBounds } from "./helpers";

export const createMouseParticles = (coords, colors) => {
  return Array.from({ length: getRandomInt(5, 20) }, () => ({
    x: coords.x,
    y: coords.y,
    color: colors[Math.floor(Math.random() * colors.length)],
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
```

- [ ] **Step 2: Wire the click into `lib/game/index.js`**

Add the imports:

```js
import { initEnemies, updateEnemies, drawEnemies, hitEnemies } from "./enemies";
import {
  createMouseParticles,
  updateMouseParticles,
  drawMouseParticles,
} from "./mouse-particles";
```

Add the two constants beside `wordmark` at the top of the file:

```js
const gravity = 0.025;
const cursorGrowDuration = 200;
```

Add the particles array beside `enemies`:

```js
  let particles = [];
```

Add the `pointerdown` handler below `handlePointerLeave`. It never calls `preventDefault`, so a touch drag still scrolls the page; a tap on an enemy still pops it.

```js
  const handlePointerDown = (event) => {
    const coords = toCanvasCoords(event);

    if (event.pointerType === "mouse") {
      pointer.x = coords.x;
      pointer.y = coords.y;
      pointer.active = true;
      pointer.growUntil = performance.now() + cursorGrowDuration;
    }

    const result = hitEnemies(enemies, coords);
    enemies = result.enemies;

    if (!result.hit) return;

    particles = particles.concat(createMouseParticles(coords, colors));
    score += 1;
    letters = initLetters(canvas, `SCORE: ${score}`.split(""), colors);
  };
```

`performance.now()` shares its time origin with the rAF timestamp, so comparing them in `drawCursor` is correct.

Extend the loop:

```js
  const loop = (time) => {
    updateText(canvas, letters, time);
    enemies = updateEnemies(canvas, enemies, score);
    particles = updateMouseParticles(canvas, particles, gravity);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawText(ctx, letters);
    drawEnemies(ctx, enemies);
    drawMouseParticles(ctx, particles);
    drawCursor(ctx, pointer, time);

    frame = window.requestAnimationFrame(loop);
  };
```

Register and unregister the listener alongside the others:

```js
  canvas.addEventListener("pointerdown", handlePointerDown);
```

```js
      canvas.removeEventListener("pointerdown", handlePointerDown);
```

- [ ] **Step 3: Verify the build passes**

Run: `yarn build`
Expected: `Compiled successfully`, no ESLint errors.

- [ ] **Step 4: Verify in the browser**

Run `yarn dev` and open http://localhost:3000.

Expected:
- Clicking an orange square removes it, bursts 5–20 small coloured squares outward that arc downward under gravity, and a replacement enemy spawns to keep the count at five.
- The wordmark changes from `SANDERSOM` to `SCORE: 1`, then `SCORE: 2`, and so on. It stays centred and keeps waving.
- The ring cursor briefly doubles in size on each click, then shrinks back after ~200ms.
- Clicking empty canvas does nothing except the cursor grow — no score, no particles.
- With a few points on the board, the enemies visibly move faster and more erratically.
- Clicking a filter checkbox at the top of the page toggles the filter and does **not** score a point.

- [ ] **Step 5: Verify touch, using Chrome's device toolbar**

Open Chrome DevTools, toggle the device toolbar (iPhone preset), and reload.

Expected:
- No ring cursor is drawn.
- Tapping an enemy pops it and scores.
- A vertical drag scrolls the page down to the intro copy and the timeline — the game does not trap the gesture.

- [ ] **Step 6: Commit**

```bash
git add lib/game
git commit -m "Added enemy popping, particle bursts and the score to the canvas hero"
```

---

## Done

The homepage hero is the game. `yarn build` passes, the loop cancels on unmount, and the timeline line runs over the canvas from the top of the viewport into the timeline below.

Out of scope, per the spec: pausing the loop when the hero scrolls out of view, and persisting a high score.
