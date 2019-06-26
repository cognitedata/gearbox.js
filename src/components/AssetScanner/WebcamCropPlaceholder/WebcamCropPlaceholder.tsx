import React from 'react';
import { getMiddlePixelsOfContainer } from '../../../utils/utils';

export interface WebcamCropPlaceholderProps {
  height: number;
  width: number;
}

export const WebcamCropPlaceholder = (props: WebcamCropPlaceholderProps) => {
  const { width, height } = props;

  const canvasRef = React.useRef(null);
  const rootDivRef = React.useRef(null);

  const drawCanvas = (
    canvasRef: any,
    width: number,
    height: number,
    parentWidth: number,
    parentHeight: number
  ) => {
    const { sx, sy, dx, dy } = getMiddlePixelsOfContainer(
      width,
      height,
      parentWidth,
      parentHeight
    );
    console.log(sx, sy, dx, dy, width, height, parentHeight, parentWidth);
    const canvas = canvasRef.current;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.fillStyle = 'rgba(0,0,0,0.4)';
    canvas.width = parentWidth;
    canvas.height = parentHeight;
    const ctx = canvas.getContext('2d');
    ctx.fillRect(0, 0, parentWidth, parentHeight);
    ctx.clearRect(sx, sy, dx, dy);
    ctx.save();
  };

  React.useEffect(() => {
    console.log('Drawing canvas');
    const divHeight = rootDivRef ? rootDivRef.current.offsetHeight : 0;
    const divWidth = rootDivRef ? rootDivRef.current.clientWidth : 0;
    drawCanvas(canvasRef, width, height, divWidth, divHeight);
  }, []);

  return (
    <div
      ref={rootDivRef}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};
