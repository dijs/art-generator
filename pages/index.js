import Script from 'next/script';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const canvas = useRef();
  const [loaded, setLoaded] = useState(false);
  const [arc, setArc] = useState(0);
  const [size, setSize] = useState(3);
  const [seed, setSeed] = useState('hello');
  const [paletteUrl, setPaletteUrl] = useState(
    'https://coolors.co/palette/ccd5ae-e9edc9-fefae0-faedcd-d4a373'
  );
  const [paths, setPaths] = useState('3,7,5');
  let lastSeeds = useRef([]);

  useEffect(() => {
    if (!loaded) return;

    const ctx = canvas.current.getContext('2d');

    const canvasSize = canvas.current.width;
    const cellSize = canvasSize / size;

    let verticies = [];

    const myrng = new Math.seedrandom(seed);
    let palette = paletteUrl
      .substring(27)
      .split('-')
      .map((e) => '#' + e);

    function reset() {
      verticies = [];

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
    }

    function addPoint(p1, p2, i) {
      ctx.arcTo(p1.x, p1.y, p2.x, p2.y, parseInt(arc, 10));
    }

    function jumpAround(n) {
      ctx.beginPath();
      for (let i = 1; i <= n; i++) {
        addPoint(verticies[i - 1], verticies[i], i - 1);
      }
      ctx.fill();
    }

    // shuffle palette
    for (let i = 0; i < palette.length; i++) {
      let t = palette[i];
      const r = Math.floor(myrng() * palette.length);
      palette[i] = palette[r];
      palette[r] = t;
    }

    ctx.fillStyle = palette[0];
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    reset();

    let colorIndex = 1;
    paths.split(',').forEach((n) => {
      ctx.fillStyle = palette[colorIndex];
      colorIndex = (colorIndex + 1) % palette.length;
      jumpAround(parseInt(n, 10));
    });
  }, [size, seed, paletteUrl, paths, arc, loaded]);

  function generateRandomSeed() {
    lastSeeds.current.push(seed);
    setSeed((Math.random() * 100000) | (0 + ''));
  }

  function recoverLastSeed() {
    if (lastSeeds.current.length) {
      setSeed(lastSeeds.current.pop());
    }
  }

  return (
    <main>
      <Script
        async
        onLoad={() => setLoaded(true)}
        src="https://cdnjs.cloudflare.com/ajax/libs/seedrandom/3.0.5/seedrandom.min.js"
      />
      <canvas ref={canvas} width="400" height="400"></canvas>
      <div>
        <label>
          Grid Size
          <input
            type="number"
            min={2}
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
        </label>
        <label>
          Random Seed
          <input
            type="text"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
          />
        </label>
        <label>
          <span>
            Palette from
            <a href="https://coolors.co/">https://coolors.co/</a>
          </span>
          <input
            type="text"
            value={paletteUrl}
            onChange={(e) => setPaletteUrl(e.target.value)}
          />
        </label>
        <label>
          Paths
          <input
            type="text"
            value={paths}
            onChange={(e) => setPaths(e.target.value)}
          />
        </label>
        <label>
          Arc Radius (0 for straight lines)
          <input
            type="number"
            value={arc}
            onChange={(e) => setArc(e.target.value)}
          />
        </label>
        <button onClick={generateRandomSeed}>Random Seed</button>
        <button onClick={recoverLastSeed}>Go to previous seed</button>
      </div>
      <p>Tip: You can right-click and save the image if you love it!</p>
    </main>
  );
}
