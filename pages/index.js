import { useContext } from 'react';
import Canvas from '../components/Canvas';
import { AppContext } from '../components/context';

export default function Home() {
  const {
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
  } = useContext(AppContext);

  return (
    <main>
      <Canvas />
      <div className="controls">
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
            Palette from{' '}
            <a
              target="_blank"
              href="https://coolors.co/palettes/trending"
              rel="noreferrer"
            >
              https://coolors.co/
            </a>
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
            value={pathSizes}
            onChange={(e) => setPathSizes(e.target.value)}
          />
        </label>
        <label>
          Slope (0.5 for straight lines)
          <input
            type="number"
            value={slope}
            step={0.1}
            onChange={(e) => setSlope(e.target.value)}
          />
        </label>
        <label>
          Y Intercept (the b in y=mx+b)
          <input
            type="number"
            value={intercept}
            onChange={(e) => setIntercept(e.target.value)}
          />
        </label>
        <button onClick={generateRandomSeed}>Random Seed</button>
        <button onClick={recoverLastSeed}>Go to previous seed</button>
        <p>Tip: You can right-click and save the image if you love it!</p>
      </div>
    </main>
  );
}
