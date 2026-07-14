const fontFamily = '"Bytesized"';

const letterSize = 96;
const letterWidth = 64;

// Distance from the top of the card to the top of the letters. drawText sets the
// baseline to "top" so this is the gap you actually see, rather than the offset of an
// alphabetic baseline that would hang most of a 96px glyph off the canvas.
const topOffset = 32;

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
    y: topOffset,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
};

export const updateLetters = (canvas, letters) => {
  letters.forEach((l, i) => {
    l.x = letterX(canvas, letters.length, i);
    l.y = topOffset;
  });
};

export const updateText = (canvas, letters, time) => {
  const wave = time * waveSpeed;

  letters.forEach((l, i) => {
    l.y = topOffset + Math.sin(wave + i * waveFrequency) * waveAmplitude;
  });
};

export const drawText = (ctx, letters) => {
  ctx.font = `${letterSize}px ${fontFamily}`;
  ctx.textBaseline = "top";

  letters.forEach((l) => {
    ctx.fillStyle = l.color;
    ctx.fillText(l.letter, l.x, l.y);
  });
};
