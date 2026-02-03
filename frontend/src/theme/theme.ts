import { createTheme } from "@mui/material/styles";

export type Theme = "light" | "dark"

export const getTheme = (mode: Theme) =>
  createTheme({
    palette: {
      mode,

      // teals
      teal: {
        100: "#1a746b",
        200: "#145e57",
        300: "#0f4a45",
      },

      level: {
        beginner: "#22c55e",     
        intermediate: "#3b82f6", 
        advanced: "#a855f7",   
      },

      ...(mode === "light"
        ? {
            // LIGHT MODE 
            primary: {
              main: "#0f766e", // emerald-ish
            },

            background: {
              default: "#f8fafc",
              paper: "#ffffff",
            },

            glassBackground: "rgba(255,255,255,0.5)",

            text: {
              primary: "#0f172a",
              secondary: "#475569",
            },

            divider: "rgba(15,23,42,0.08)",
          }
        : {
            //  DARK MODE 
            primary: {
              main: "#2dd4bf", // toska hijau (AKSEN)
            },

            background: {
              default: "#0b0f0e", // background utama
              paper: "#111716",   // card / surface
            },

            glassBackground: "rgba(0,0,0,0.5)",

            text: {
              primary: "#e5e7eb",
              secondary: "#9ca3af",
            },

            divider: "rgba(255,255,255,0.08)",
          }),
    },

    shape: {
      borderRadius: 12,
    },
    
  
  });

