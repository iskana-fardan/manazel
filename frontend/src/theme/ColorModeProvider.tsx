import { useMemo, useState, type ReactNode } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import ColorModeContext from "./ColorModeContext";
import { getTheme } from "./theme";

interface Props {
  children: ReactNode;
}

const ColorModeProvider = ({ children }: Props) => {
  const [mode, setMode] = useState<"dark" | "light" >("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => (prev ===  "dark" ? "light"  : "dark"));
      },
    }),
    []
  );

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ColorModeProvider;
