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
