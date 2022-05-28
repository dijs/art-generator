import Script from 'next/script';
import { useState, useRef, createContext } from 'react';

export const AppContext = createContext({});

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
        palette: loaded ? getPalette(seed, paletteUrl) : [],
        loaded,
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
