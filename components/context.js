import Script from 'next/script';
import { useState, useRef, createContext } from 'react';

export const AppContext = createContext({});

const canvasSize = 400;

function getPalette(seed, url) {
  const myrng = new Math.seedrandom(seed);

  const palette = url
    .substring(27)
    .split('-')
    .map((e) => '#' + e);

  // shuffle
  for (let i = 0; i < palette.length; i++) {
    let t = palette[i];
    const r = Math.floor(myrng() * palette.length);
    palette[i] = palette[r];
    palette[r] = t;
  }

  return palette;
}

function getVerticies(seed, size) {
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

  return verticies;
}

export function AppProvider({ children }) {
  const [loaded, setLoaded] = useState(false);
  const [slope, setSlope] = useState(0.5);
  const [intercept, setIntercept] = useState(0);
  const [size, setSize] = useState(2);
  const [seed, setSeed] = useState('hello');
  const [paletteUrl, setPaletteUrl] = useState(
    'https://coolors.co/palette/e63946-f1faee-a8dadc-457b9d-1d3557'
  );
  const [pathSizes, setPathSizes] = useState('3,7,5');
  let lastSeeds = useRef([]);

  const verticies = loaded ? getVerticies(seed, size) : [];
  const palette = loaded ? getPalette(seed, paletteUrl) : [];

  function generateRandomSeed() {
    lastSeeds.current.push(seed);
    setSeed((Math.random() * 100000) | (0 + ''));
  }

  function recoverLastSeed() {
    if (lastSeeds.current.length) {
      setSeed(lastSeeds.current.pop());
    }
  }

  function createPoint(p1, p2) {
    return {
      cx: (p1.x + p2.x) * parseFloat(slope) + parseFloat(intercept),
      cy: (p1.y + p2.y) * parseFloat(slope) + parseFloat(intercept),
      x: p2.x,
      y: p2.y,
    };
  }

  function getArt() {
    let colorIndex = 1;
    const paths = pathSizes.split(',').map((size) => {
      const n = parseInt(size, 10);
      const color = palette[colorIndex];
      colorIndex = (colorIndex + 1) % palette.length;

      const points = [];
      if (verticies.length) {
        for (let i = 1; i <= n; i++) {
          points.push(createPoint(verticies[i - 1], verticies[i]));
        }
      }

      return {
        color,
        start: verticies[0],
        points,
      };
    });

    return {
      bg: palette[0],
      size: canvasSize,
      paths,
    };
  }

  return (
    <AppContext.Provider
      value={{
        slope,
        setSlope,
        intercept,
        setIntercept,
        size,
        setSize,
        seed,
        setSeed,
        paletteUrl,
        setPaletteUrl,
        pathSizes,
        setPathSizes,
        generateRandomSeed,
        recoverLastSeed,
        canvasSize,
        loaded,
        verticies,
        palette,
        getArt,
      }}
    >
      <Script
        async
        onLoad={() => setLoaded(true)}
        src="https://cdnjs.cloudflare.com/ajax/libs/seedrandom/3.0.5/seedrandom.min.js"
      />
      {children}
    </AppContext.Provider>
  );
}
