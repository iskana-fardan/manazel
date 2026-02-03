import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import { IconButton, useTheme } from "@mui/material"
import { useColorMode } from "../theme/useColorMode";

const ColorModeSwitch = () => {
  const theme = useTheme();
  const {toggleColorMode} = useColorMode();


  return (
    <IconButton
        disableRipple
        onClick={toggleColorMode}
        sx={{
            fontSize: 16, // icon ikut ini
            color: "text.primary",
            borderRadius: "5px",
            "&:hover": {
            backgroundColor: "rgba(100,100,100,0.1)",
            },
        }}
    >
        {theme.palette.mode === "dark" ?  <LightModeOutlined sx={{ fontSize: "inherit" }}  /> : <DarkModeOutlined sx={{ fontSize: "inherit" }} /> }
    </IconButton>
    )
}

export default ColorModeSwitch

