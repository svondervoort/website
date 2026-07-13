# Canvas Game Hero — Design

Date: 2026-07-13

## Goal

Replace the static `SANDERSOM` block at the top of the homepage with the interactive
canvas game currently living in the separate `svondervoort-landing` project. The
vertical timeline line must run over the game, so it reads as a scroll affordance.

## Current state

**Website** (`svondervoort-website`) — Next 12, React 18, Tailwind, pages router.
The block to replace is the `aspect-square` div at `pages/index.js:94-104`: a bordered
box containing an `<h1>` that renders `SAN / DER / SOM` in Major Mono Display. It sits
inside a `container mx-auto md:max-w-3xl … pl-16` div whose `before:` pseudo-element
draws the vertical white line (`before:left-4 before:w-0.5 before:bg-white/50`,
spanning `top-0` to `bottom-0`). Each `components/timeline.js` item repeats that same
pseudo-element, so the line appears continuous down the page.

**Landing** (`../svondervoort-landing`) — six vanilla ES modules, no build step:
`script.js` (entry, rAF loop, listeners), `text.js` (wavy letters), `enemies.js`
(drifting orange squares), `mouseParticles.js` (click burst), `cursor.js` (drawn ring),
`canvas.js` + `helpers.js`. Gameplay: letters wave in a sine; orange squares drift with
random motion; clicking one pops it into particles, increments the score, and the
headline text flips to `SCORE: n`. Enemy speed and randomness scale with score.

## Decisions

| Decision | Choice |
| --- | --- |
| Canvas bounds | Full-bleed, viewport width |
| Hero height | Full viewport height (100vh) |
| Wordmark | Removed from HTML; the canvas letters *are* the wordmark |
| Style | Hybrid — transparent canvas over the site's green gradient, Bytesized letters, orange `#fc814a` enemies |
| Touch | Playable (tap to pop), no drawn cursor, scroll never blocked |

## Architecture

The game is ported as a framework-agnostic module set. React only owns mount/unmount.

```
lib/game/helpers.js         getRandomInt, getRandomNonZeroFloat   (unchanged)
lib/game/canvas.js          resize / buffer sizing
lib/game/text.js            wavy letters      — canvas passed in
lib/game/enemies.js         drifting squares  — canvas passed in
lib/game/mouse-particles.js click burst       — canvas passed in
lib/game/cursor.js          drawn ring cursor
lib/game/index.js           createGame(canvas) => { destroy() }
components/game.js          React wrapper: <canvas ref> + useEffect(createGame)
```

`createGame(canvas)` is a factory. It closes over its own `enemies`, `letters`,
`mouseParticles`, `score` and `mouseCoords`, wires listeners, starts the rAF loop, and
returns `destroy()` which cancels the loop and removes every listener.

### Why a factory rather than module singletons

The landing keeps `let enemies = []` at module scope and `initEnemies()` *pushes*
without clearing. ES modules are singletons, so that state survives unmount. Under React
18 StrictMode the effect mounts twice in development: two rAF loops, doubled listeners,
ten enemies instead of five. A factory that owns its state makes remount free and needs
no reset functions.

## The three non-mechanical ports

### 1. `text.js` reads a bare `canvas` global

`text.js` never imports `canvas`, yet reads `canvas.width` / `canvas.height`. It works
today only because `<canvas id="canvas">` auto-creates `window.canvas` via named-element
access. A `useRef` canvas creates no such global, so this breaks the moment it is ported.

`initLetters`, `updateLetters` and `updateText` take the canvas as a parameter.

`enemies.js` and `mouseParticles.js` use `window.innerWidth` / `window.innerHeight` for
their out-of-bounds checks. Those happen to coincide with the buffer size today
(`pixelRatio: 1`, fullscreen canvas) but drift the instant anything changes. They read
`canvas.width` / `canvas.height` instead.

### 2. Listeners bind to the canvas, not `document`

The landing binds `mousemove` and `mousedown` to `document`, so a click on the filter
checkboxes or anywhere in the timeline would count as game input. Listeners bind to the
canvas element, and pointer coordinates map through `getBoundingClientRect()` rather than
assuming the canvas sits at viewport `0,0` (it does not — the page scrolls).

### 3. The rAF loop gets a real handle

The landing declares `function requestAnimationFrame()` which shadows the global of the
same name and recurses. Untangle into a plain loop that stores the frame id so
`destroy()` can `cancelAnimationFrame` it.

## Layout

Remove the `aspect-square` box and its `<h1>` from `pages/index.js`. Keep a
visually-hidden `<h1>SANDERSOM</h1>` for SEO and screen readers.

The hero becomes the first child of the existing `max-w-3xl` container — the same
container that draws the vertical line. The canvas breaks out to full-bleed from inside
it:

```
absolute left-1/2 -translate-x-1/2 w-screen h-full
```

on a wrapper that cancels the container's left padding and fills the visible screen:

```
relative -ml-16 h-[calc(100vh-8rem)] lg:-ml-24 lg:h-[calc(100vh-12rem)]
```

The negative margin matters: the canvas's containing block is the wrapper, so without it
`left-1/2` centres on the container's *padded* box and the wordmark lands half the padding
right of true centre. The height is the viewport minus the page's top offset (`main`'s
`pt-24 lg:pt-32` plus the container's `py-8 lg:py-16`), so the hero fills exactly the
visible screen instead of running past the fold.

The canvas sits below the line in z-order. Because the container's `before:` line already spans
`top-0` to `bottom-0`, extending the container upward with the hero means one continuous
line runs from the top of the 100vh hero, past the intro copy, into the timeline. No
separate line element is needed.

The line gets `pointer-events-none` so it does not swallow clicks meant for the canvas.

`overflow-x` must be clipped on the body so the `w-screen` breakout cannot introduce a
horizontal scrollbar.

## Style

- Canvas background stays transparent; the page's green gradient shows through.
- Letters render in Bytesized. Add it to the Google Fonts `<link>` in `pages/_document.js`.
  Gate the first paint on `document.fonts.ready` so letters do not flash in a fallback face.
- Enemies keep `#fc814a`. Letter palette keeps the landing's five colours.
- The landing's text reads `SANDEROM` (missing an S). Use `SANDERSOM`.

## Touch behaviour

- Tapping an enemy pops it and scores, same as a click.
- The drawn ring cursor is only rendered when a real pointer is present (a `mousemove`
  has been seen); on touch it is skipped. `cursor: none` applies only to the canvas, and
  only on fine pointers.
- No handler calls `preventDefault`, so a vertical drag still scrolls the page.

## Out of scope

- Pausing the rAF loop when the hero scrolls out of view. Cheap to add later; not required.
- Persisting or displaying a high score.
- Any change to the timeline, filters, or Contentful data loading.
