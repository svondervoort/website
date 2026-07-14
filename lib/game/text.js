const fontFamily = '"Bytesized"';

// The size the letters want to be. They only ever shrink from here, so a wide canvas
// looks exactly as it did before the text learned to scale.
const maxLetterSize = 96;
const maxLetterWidth = 64;

// How much of the canvas the longest word may span, leaving the letters clear of the
// card's border.
const widthRatio = 0.9;

// Distance from the bottom of the card to the bottom of the letters. drawText sets the
// baseline to "bottom" so this is the gap you actually see, and so it holds whatever
// size the letters have scaled to.
const bottomOffset = 32;

const baseY = (canvas) => canvas.height - bottomOffset;

const waveSpeed = 0.003;
const waveAmplitude = 16;
const waveFrequency = 1;

// Letters are laid out on a fixed advance rather than measured, so the whole word is
// as wide as its character count. A narrow canvas — or a longer word, since SCORE: 12
// runs to nine characters — would otherwise push the ends off both edges.
const scaleToFit = (canvas, count) => {
  return Math.min(1, (canvas.width * widthRatio) / (count * maxLetterWidth));
};

const letterX = (canvas, count, index, width) => {
  return (canvas.width - count * width) / 2 + index * width;
};

const place = (canvas, letters) => {
  const scale = scaleToFit(canvas, letters.length);
  const width = maxLetterWidth * scale;

  letters.forEach((l, i) => {
    l.x = letterX(canvas, letters.length, i, width);
    l.y = baseY(canvas);
    l.size = maxLetterSize * scale;
  });

  return letters;
};

export const initLetters = (canvas, text, colors) => {
  return place(
    canvas,
    text.map((letter) => ({
      letter,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
  );
};

export const updateLetters = (canvas, letters) => {
  place(canvas, letters);
};

export const updateText = (canvas, letters, time) => {
  const wave = time * waveSpeed;

  letters.forEach((l, i) => {
    // The wave rides the letters down with them, so it stays a bob rather than
    // becoming a lurch once the text is small.
    const amplitude = waveAmplitude * (l.size / maxLetterSize);

    l.y = baseY(canvas) + Math.sin(wave + i * waveFrequency) * amplitude;
  });
};

export const drawText = (ctx, letters) => {
  ctx.textBaseline = "bottom";

  letters.forEach((l) => {
    ctx.font = `${l.size}px ${fontFamily}`;
    ctx.fillStyle = l.color;
    ctx.fillText(l.letter, l.x, l.y);
  });
};
