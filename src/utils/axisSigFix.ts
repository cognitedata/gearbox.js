// Copyright 2020 Cognite AS
const countDecimals = (num: number) => {
  if (!Number.isNaN(num) && Math.floor(num) !== num) {
    return num.toString().split('.')[1].length || 0;
  }
  return 0;
};

const findMaxDecimals = (array: number[]) =>
  array.reduce((max, current) => Math.max(max, countDecimals(current)), 0);

export const decimalTickFormatter = (tick: number, ticks: number[]) =>
  tick.toFixed(findMaxDecimals(ticks));
