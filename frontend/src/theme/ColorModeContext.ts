import { createContext } from "react";

interface ColorModeContextType {
    toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextType | undefined>(undefined);

export default ColorModeContext;
