import { Box, Button, Drawer, IconButton, Typography, useTheme } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LightModeOutlined, DarkModeOutlined } from "@mui/icons-material";
import { useColorMode } from "../../theme/useColorMode";
import { useNavItems } from "./useNavItems";

interface Props {
    open: boolean
    onClose: () => void
}

const MobileMenu = ({ open, onClose }:Props) => {
  const theme = useTheme();
  const navItems = useNavItems();
  const location = useLocation();
   const navigate = useNavigate();
  const {toggleColorMode} = useColorMode();


  const handleAnchorClick = (anchorId: string) => {
    const scrollToAnchor = () => {
      const el = document.getElementById(anchorId)
      if(el){
        el.scrollIntoView({ behavior: "smooth" })
      }
    }

    
    if (location.pathname !== "/"){
      navigate("/")
      setTimeout(scrollToAnchor,150)
    }else {
      scrollToAnchor()
    }
  }

  
  return (
    <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{
            paper: {
                sx: {
                    width: {xs : "80%", sm: 320},
                    backgroundImage: "none",
                    borderLeft: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    justifyContent: 'space-between'
                }
            }
        }}
    >
       <Box>
            {/* Header */}
            <Box 
                px={2}
                py={2.2}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'space-between'}
                borderBottom= {`1px solid ${theme.palette.divider}`}
            >
                <Typography fontWeight={600}>Menu</Typography>

                <IconButton
                        aria-label="Close menu"
                        disableRipple
                        onClick={onClose}
                        sx={{
                            fontSize: 16, // icon ikut ini
                            color: "text.primary",
                            borderRadius: "5px",
                            "&:hover": {
                            backgroundColor: "rgba(100,100,100,0.1)",
                            },
                        }}
                    >
                        <CloseIcon sx={{ fontSize: "inherit" }} />
                    </IconButton>
            </Box>

            {/* Links */}
            <Box px={1} sx={{ display: "flex", gap: 0.5,flexDirection: "column", marginTop: 2, px:2}}>
                {navItems.map((item) => {
                    const isActive = item.type === "route" && location.pathname === item.path

                     // ROUTE ITEM
                    if (item.type === "route") {
                        return (
                            <Button
                                disableRipple
                                key={item.label}
                                component={NavLink}
                                to={item.path}
                                onClick={onClose}
                                sx={{
                                        justifyContent: "flex-start",
                                        textTransform: "none",
                                        borderRadius: "5px",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        color: "text.primary",
                                        px: 2,
                                        py: 0.8,

                                        // hover
                                        "&:hover": {
                                            backgroundColor: "rgba(100,100,100,0.1)",
                                            color:"text.primary"
                                        },

                                        // selected / active
                                        backgroundColor: isActive
                                            ? "rgba(90, 130, 126, 0.2)"
                                            : "transparent",
                                    }}
                            >
                                {item.label}
                            </Button>
                        )
                    }

                    // ANCHOR ITEM
                     return (
                        <Button
                            disableRipple
                            key={item.label}
                            onClick={() => {
                                onClose()
                                handleAnchorClick(item.anchor)
                            }}
                            sx={{
                                justifyContent: "flex-start",
                                textTransform: "none",
                                borderRadius: "5px",
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "text.primary",
                                px: 2,
                                py: 0.8,

                                // hover
                                "&:hover": {
                                    backgroundColor: "rgba(100,100,100,0.1)",
                                    color:"text.primary"
                                },

                                // selected / active
                                backgroundColor: isActive
                                    ? "rgba(90, 130, 126, 0.2)"
                                    : "transparent",
                            }}
                        >
                            {item.label}
                        </Button>
                    )
            })}
            </Box>
        </Box>
        {/* Footer */}
        <Box sx={{ borderTop : `1px solid ${theme.palette.divider}`, padding: 2 }}>
            <IconButton
                    aria-label="Toggle color mode"
                    disableRipple
                    onClick={toggleColorMode}
                    sx={{
                        fontSize: 16,
                        color: "text.primary",
                        borderRadius: "5px",
                        "&:hover": {
                            border: `1px solid ${theme.palette.divider}`,
                            backgroundColor: "rgba(100,100,100,0.1)",
                        },
                        border: `1px solid ${theme.palette.divider}`,
                        width: '100%',
                        display: 'flex',
                        justifyContent: "flex-start",
                        alignItems: "center",
                        gap: 1,
                        px: 2,
                        py: 1.1
                    }}
                >
                    {theme.palette.mode === "dark" ?  <LightModeOutlined sx={{ fontSize: "inherit" }}  /> : <DarkModeOutlined sx={{ fontSize: "inherit" }} /> }
                    <Typography
                        textTransform={'capitalize'}
                        lineHeight={1}
                        sx={{ marginTop: '3px'}} 
                        >{theme.palette.mode === 'dark' ? "light mode" : "dark mode"}
                    </Typography>
                </IconButton>
                
        </Box>
    </Drawer>
  )
}

export default MobileMenu