import { GearboxTheme } from '../components/ThemeProvider';

export const applyThemeFontFamily = (gearboxTheme: GearboxTheme) =>
  gearboxTheme.fontFamily ? `font-family: ${gearboxTheme.fontFamily}` : '';

export const applyThemeFontSize = (gearboxTheme: GearboxTheme) =>
  gearboxTheme.fontSize ? `font-size: ${gearboxTheme.fontSize}` : '';

export const applyThemeListHighlight = (gearboxTheme: GearboxTheme) =>
  gearboxTheme.listHighlight
    ? `background: ${gearboxTheme.listHighlight} !important`
    : '';
