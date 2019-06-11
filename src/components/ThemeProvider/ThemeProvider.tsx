import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { defaultTheme } from '../../theme/defaultTheme';

type GearboxThemeKey = keyof typeof defaultTheme;

export interface GearboxThemeOptional {
  fontFamily?: string;
  fontSize?: string;
  listHighlight?: string;
}

export type GearboxTheme = { [key in GearboxThemeKey]?: string } &
  GearboxThemeOptional;

export interface ThemeProviderProps {
  theme: GearboxTheme;
  children: React.ReactChild;
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
