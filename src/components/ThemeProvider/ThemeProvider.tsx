import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { defaultTheme } from '../../theme/defaultTheme';

type GearboxThemeKey = keyof typeof defaultTheme;

export type GearboxTheme = Partial<{ [key in GearboxThemeKey]: string }>;

export interface ThemeProviderProps {
  theme: GearboxTheme;
  children: any;
}

export const ThemeProvider = (props: ThemeProviderProps) => {
  const theme = {
    gearbox: {
      ...defaultTheme,
      ...props.theme,
    },
  };
  return (
    <StyledThemeProvider theme={theme}>{props.children}</StyledThemeProvider>
  );
};
