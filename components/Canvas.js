import { useContext, useRef, useEffect } from 'react';
import { AppContext } from './context';

export default function Canvas({ canvasSize = 400 }) {
  const canvas = useRef();
  const {
    size,
    seed,
    paletteUrl,
    pathSizes,
    slope,
    intercept,
    loaded,
    palette,
  } = useContext(AppContext);

  useEffect(() => {
    const ctx = canvas.current ? canvas.current.getContext('2d') : null;

    if (!loaded) return;

    const canvasSize = canvas.current ? canvas.current.width : 0;
    const cellSize = canvasSize / size;

    const myrng = new Math.seedrandom(seed);
    const verticies = [];

    for (let x = 0; x <= size; x++) {
      for (let y = 0; y <= size; y++) {
        verticies.push({
          x: cellSize * x,
          y: cellSize * y,
        });
      }
    }

    // shuffle
    for (let i = 0; i < verticies.length; i++) {
      let t = {
        ...verticies[i],
      };
      const r = Math.floor(myrng() * verticies.length);
      verticies[i] = verticies[r];
      verticies[r] = t;
    }

    function addPoint(p1, p2) {
      ctx.quadraticCurveTo(
        (p1.x + p2.x) * parseFloat(slope) + parseFloat(intercept),
        (p1.y + p2.y) * parseFloat(slope) + parseFloat(intercept),
        p2.x,
        p2.y
      );
    }

    function jumpAround(n) {
      ctx.beginPath();
      ctx.moveTo(verticies[0].x, verticies[0].y);
      for (let i = 1; i <= n; i++) {
        addPoint(verticies[i - 1], verticies[i]);
      }
      ctx.fill();
    }

    ctx.fillStyle = palette[0];
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    let colorIndex = 1;
    pathSizes.split(',').forEach((n) => {
      ctx.fillStyle = palette[colorIndex];
      colorIndex = (colorIndex + 1) % palette.length;
      jumpAround(parseInt(n, 10));
    });
  }, [size, seed, paletteUrl, pathSizes, slope, intercept, loaded, palette]);

  return (
    <div className="art">
      <canvas ref={canvas} width="400" height="400"></canvas>
      <svg width="400" height="400">
        <rect
          width={canvasSize}
          height={canvasSize}
          style={{ fill: palette[0] }}
        />
      </svg>
    </div>
  );
}
