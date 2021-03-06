import { Button, Slider } from '@mui/material';
import { useContext } from 'react';
import { AppContext } from '../components/context';

export default function Controls() {
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
    <div className="controls">
      <label>
        Resolution
        <Slider
          min={2}
          max={16}
          valueLabelDisplay="auto"
          aria-label="Resolution"
          value={size}
          onChange={(_, value) => setSize(value)}
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
          Use URL from a{' '}
          <a
            target="_blank"
            href="https://coolors.co/palettes/trending"
            rel="noreferrer"
          >
            https://coolors.co/
          </a>{' '}
          theme
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
        <Slider
          min={-2}
          max={2}
          step={0.1}
          aria-label="Slope"
          valueLabelDisplay="auto"
          value={slope}
          onChange={(_, value) => setSlope(value)}
        />
      </label>
      <label>
        Y Intercept (the b in y=mx+b) {intercept}
        <Slider
          min={-100}
          max={100}
          aria-label="Intercept"
          valueLabelDisplay="auto"
          value={intercept}
          onChange={(_, value) => setIntercept(value)}
        />
      </label>
      <Button variant="contained" onClick={generateRandomSeed}>
        Random Seed
      </Button>
      <Button variant="outlined" onClick={recoverLastSeed}>
        Go to previous seed
      </Button>
      <p>Tip: You can right-click and save the image if you love it!</p>
    </div>
  );
}
