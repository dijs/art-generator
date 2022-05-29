import { useContext } from 'react';
import { AppContext } from './context';

export default function Canvas() {
  const { getBlobUrl, canvasSize } = useContext(AppContext);

  return (
    <div className="art">
      <img
        width={canvasSize}
        height={canvasSize}
        src={getBlobUrl()}
        alt="art"
      />
    </div>
  );
}
