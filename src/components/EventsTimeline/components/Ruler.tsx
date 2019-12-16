import React, { useState } from 'react';

export interface EventTimelineRulerProps {
  width: number;
  height: number;
  onMouseMove?: (e: React.SyntheticEvent | null) => void;
}

export const Ruler: React.FC<EventTimelineRulerProps> = props => {
  const { width, height, onMouseMove } = props;
  const [x, setX] = useState<number | null>(null);

  const mouseMoveHandler = (e: React.SyntheticEvent) => {
    const { offsetX } = e.nativeEvent as MouseEvent;

    setX(offsetX);

    if (onMouseMove) {
      onMouseMove(e);
    }
  };

  const hideRuler = () => {
    setX(null);
    if (onMouseMove) {
      onMouseMove(null);
    }
  };

  return (
    <g>
      {x !== null && (
        <path
          style={{ pointerEvents: 'none' }}
          d={`M0,0V${height}`}
          stroke={'#ccc'}
          strokeWidth={1}
          transform={`translate(${x}, 0)`}
        />
      )}
      <rect
        style={{ pointerEvents: 'all' }}
        x={0}
        y={0}
        width={width}
        height={height}
        fill={'none'}
        onMouseMove={mouseMoveHandler}
        onMouseLeave={hideRuler}
      />
    </g>
  );
};
