const src = "/sander-removebg.png";

// Sparse to dense: the brighter the pixel, the more ink its character carries.
const ramp = " .:-=+*#%@";

const color = "#FFFFFF";
const opacity = 0.18;

// Popping enemies resolves the ASCII into the photograph it was sampled from. The
// reveal eases toward the score rather than tracking it exactly, so each point reads
// as the image sharpening rather than as a step, and so it keeps resolving after the
// last enemy is gone.
const revealedOpacity = 0.85;
const revealEase = 0.04;

const fontFamily = "monospace";
const cellHeight = 8;

// A monospace glyph is roughly 0.6 as wide as it is tall. Sampling on a square grid
// would stretch the portrait horizontally, so the cells carry the same ratio.
const cellWidth = cellHeight * 0.6;

// The bust is scaled past the card's height so the head, which is only a third of it,
// gets enough character rows to read as a face. The shoulders bleed off the bottom,
// which the card already clips.
const heightScale = 1.4;

// Anchored near the top rather than centred: centring a bust this tall would clip the
// top of the head, so the shoulders take the overflow instead.
const topMargin = 0.03;

// Below this, a pixel is background rather than subject, and its cell stays blank.
const alphaThreshold = 128;

// Skin sits in a narrow band near the top of the range, so mapping raw luminance onto
// the ramp turns the whole face into one dense blob. Stretching the subject's own
// range across the ramp instead is what lets eyes and shadows read against cheeks.
// The clip keeps a few stray highlights from defining the top of the range.
const clip = 0.05;

const luminanceAt = (data, i) =>
  0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

const subjectRange = (data, count) => {
  const values = [];

  for (let i = 0; i < count; i++) {
    if (data[i * 4 + 3] >= alphaThreshold) values.push(luminanceAt(data, i * 4));
  }

  if (values.length === 0) return { min: 0, max: 255 };

  values.sort((a, b) => a - b);

  return {
    min: values[Math.floor(values.length * clip)],
    max: values[Math.floor(values.length * (1 - clip))],
  };
};

// The grid is the same every frame, so it is drawn once into its own canvas and the
// loop blits that. Rendering ~2500 characters per frame would not pay for itself.
const buildLayer = (image, canvas) => {
  const rows = Math.max(1, Math.floor((canvas.height * heightScale) / cellHeight));
  const aspect = image.width / image.height;
  const cols = Math.max(1, Math.floor((rows * cellHeight * aspect) / cellWidth));

  const sample = document.createElement("canvas");
  sample.width = cols;
  sample.height = rows;

  const sampleCtx = sample.getContext("2d", { willReadFrequently: true });
  sampleCtx.drawImage(image, 0, 0, cols, rows);

  const { data } = sampleCtx.getImageData(0, 0, cols, rows);
  const { min, max } = subjectRange(data, cols * rows);
  const span = Math.max(1, max - min);

  const layer = document.createElement("canvas");
  layer.width = Math.ceil(cols * cellWidth);
  layer.height = rows * cellHeight;

  const layerCtx = layer.getContext("2d");
  layerCtx.font = `${cellHeight}px ${fontFamily}`;
  layerCtx.textBaseline = "top";
  layerCtx.fillStyle = color;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const i = (row * cols + col) * 4;

      if (data[i + 3] < alphaThreshold) continue;

      const level = Math.max(0, Math.min(1, (luminanceAt(data, i) - min) / span));
      const character = ramp[Math.round(level * (ramp.length - 1))];

      if (character === " ") continue;

      layerCtx.fillText(character, col * cellWidth, row * cellHeight);
    }
  }

  return layer;
};

export const initPortrait = (canvas) => {
  const portrait = { image: null, layer: null, x: 0, y: 0, reveal: 0 };

  const image = new window.Image();

  image.onload = () => {
    portrait.image = image;
    updatePortrait(canvas, portrait);
  };

  image.src = src;

  return portrait;
};

export const updatePortrait = (canvas, portrait) => {
  if (portrait.image === null) return;

  const layer = buildLayer(portrait.image, canvas);

  portrait.layer = layer;
  portrait.x = (canvas.width - layer.width) / 2;
  portrait.y = canvas.height * topMargin;
};

export const updateReveal = (portrait, score, winScore) => {
  const target = Math.min(1, score / winScore);

  portrait.reveal += (target - portrait.reveal) * revealEase;
};

export const drawPortrait = (ctx, portrait) => {
  if (portrait.layer === null) return;

  const { image, layer, x, y, reveal } = portrait;

  ctx.save();

  if (reveal < 1) {
    ctx.globalAlpha = opacity * (1 - reveal);
    ctx.drawImage(layer, x, y);
  }

  if (reveal > 0) {
    ctx.globalAlpha = revealedOpacity * reveal;
    ctx.drawImage(image, x, y, layer.width, layer.height);
  }

  ctx.restore();
};
