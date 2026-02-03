import { AppBar, Box, Container, IconButton, Toolbar, useTheme } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useState } from "react"
import NavbarLogo from "./NavbarLogo";
import NavbarLinks from "./NavbarLinks";
import ColorModeSwitch from "../ColorModeSwitch";
import MobileMenu from "./MobileMenu";

type NavbarProps = {
    offsetTop? : number
}

const Navbar = ({offsetTop = 0}:NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,setScrolled]  =  useState(false);
  const theme = useTheme();

  useEffect(()=>{
    const onScroll = () =>{
        setScrolled(window.scrollY > 0);
    }

    window.addEventListener("scroll",onScroll);
    return () => window.removeEventListener("scroll",onScroll)
  },[])


  return (
    <>
        <AppBar
            position="fixed"
            elevation={0} // remove default shadow
            sx={{
                top:offsetTop,
                backgroundColor: scrolled ? theme.palette.glassBackground : "transparent",
                backdropFilter: scrolled ? "blur(12px)" : "none",
                borderBottom: `1px solid ${theme.palette.divider}`,
                transition: "all 0.2s ease"
            }}

        >
            <Toolbar 
                disableGutters // disableGutters: Remove right and left padding
                sx={{minHeight : { xs : 58,md: 65}}}
            > 
                <Container maxWidth="lg">
                    <Box 
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                    >
                        {/* Left */}
                        <NavbarLogo/>

                        {/* Right */}
                        <Box display={'flex'} alignItems={'center'} gap={1}>
                            <Box sx={{ display: {xs:"none", md:"flex"}}} gap={1.5}>
                                {/* navlinks */}
                                <NavbarLinks/>

                                {/* colormodeswitch */}
                                <ColorModeSwitch/>
                            </Box>

                            {/* Hamburger button */}
                            <IconButton
                                disableRipple
                                onClick={() => setMobileOpen(true)}
                                sx={{
                                    display: { xs: "flex", md: "none" },
                                    color: "text.primary",
                                    fontSize:16
                                }}
                            >
                                <MenuIcon sx={{fontSize: "inherit"}}/>
                            </IconButton>
                        </Box>

                    </Box>
                </Container>
            </Toolbar>
        </AppBar>

        {/* mobile menu */}
        <MobileMenu
            open={mobileOpen}
            onClose={()=> setMobileOpen(false)}
        />
    </>
  )
}

export default Navbar

