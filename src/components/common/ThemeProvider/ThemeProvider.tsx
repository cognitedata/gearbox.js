import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { AnyIfEmpty } from '../../../interfaces';
import { defaultTheme } from '../../../theme/defaultTheme';

type GearboxThemeKey = keyof typeof defaultTheme;

export interface GearboxThemeOptional {
  fontFamily?: string;
  fontSize?: string;
  listHighlight?: string;
}

export type GearboxTheme = { [key in GearboxThemeKey]?: string } &
  GearboxThemeOptional;

export interface ThemeProviderProps {
  theme?: AnyIfEmpty<{}> & { gearbox?: GearboxTheme };
  children: React.ReactChild;
}

export const ThemeProvider = (props: ThemeProviderProps) => {
  const external =
    props.theme && props.theme.gearbox ? props.theme.gearbox : {};
  const theme = {
    gearbox: {
      ...defaultTheme,
      ...external,
    },
  };
  return (
    <StyledThemeProvider theme={theme}>{props.children}</StyledThemeProvider>
  );
};
