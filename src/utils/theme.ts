import { GearboxTheme } from '../components/ThemeProvider';

export const applyThemeFontFamily = (gearboxTheme: GearboxTheme) =>
  gearboxTheme.textFamily ? `font-family: ${gearboxTheme.textFamily};` : '';

export const applyThemeFontSize = (gearboxTheme: GearboxTheme) =>
  gearboxTheme.textSize ? `font-size: ${gearboxTheme.textSize};` : '';
