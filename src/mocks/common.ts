export const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

export const generateNumber = (length: number = 10): number => {
  if (length > 15) {
    return 0;
  }

  const aggregator = new Array(length).fill(0);

  return Number(aggregator.map(() => Math.floor(Math.random() * 10)).join(''));
};
