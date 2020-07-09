import React, { ReactNode, FC } from 'react';

export interface SizeContextType {
  width?: number;
  height?: number;
}
export interface TimeseriesChartSizeProviderProps {
  width: number;
  height: number;
  children?: ReactNode;
}

export const SizeContext = React.createContext<SizeContextType>({});

export const TimeseriesChartSizeProvider: FC<
  TimeseriesChartSizeProviderProps
> = ({ children, ...size }: TimeseriesChartSizeProviderProps) => {
  return <SizeContext.Provider value={size}>{children}</SizeContext.Provider>;
};
