import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    level: {
      beginner: string;
      intermediate: string;
      advanced: string;
    };
    glassBackground: string;
    teal: {
        100: string,
        200: string,
        300: string,
      },
  }

  interface PaletteOptions {
    level?: {
      beginner: string;
      intermediate: string;
      advanced: string;
    };
    glassBackground?: string;
    teal?: {
        100: string,
        200: string,
        300: string,
      },
  }
}
