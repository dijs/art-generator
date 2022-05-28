import { useContext } from 'react';
import { AppContext } from './context';

export default function Canvas() {
  const { getArt } = useContext(AppContext);
  const { bg, size, paths } = getArt();

  return (
    <div className="art">
      <svg width={size} height={size}>
        <rect fill={bg} width={size} height={size} />
        {paths
          .filter((e) => e.start)
          .map(({ color, start, points }, i) => {
            return (
              <path
                fill={color}
                key={i}
                d={`M${start.x},${start.y} ${points
                  .map((p) => `Q${p.cx},${p.cy} ${p.x},${p.y}`)
                  .join(' ')}`}
              />
            );
          })}
      </svg>
    </div>
  );
}
