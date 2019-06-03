declare module 'react-odometerjs';
declare module 'react-sizeme';
declare module 'numeral';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
