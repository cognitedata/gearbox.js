// Copyright 2020 Cognite AS
import { defaultTheme } from '../../theme/defaultTheme';

type GearboxThemeKey = keyof typeof defaultTheme;

export interface GearboxThemeOptional {
  fontFamily?: string;
  fontSize?: string;
  listHighlight?: string;
}

export type GearboxTheme = { [key in GearboxThemeKey]?: string } &
  GearboxThemeOptional;
