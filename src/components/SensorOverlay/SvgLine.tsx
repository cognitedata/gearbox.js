import React from 'react';

interface SvgLineProps {
  box: {
    color: string;
    left: number;
    top: number;
    pointer: {
      left: number;
      top: number;
    };
  };
}

const SvgLine = ({ box }: SvgLineProps) => {
  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <g>
        <line
          x1={box.left}
          y1={box.top}
          x2={box.pointer.left}
          y2={box.pointer.top}
          style={{ stroke: box.color, strokeWidth: 2 }}
        />
      </g>
    </svg>
  );
};

export default SvgLine;
