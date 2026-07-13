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
