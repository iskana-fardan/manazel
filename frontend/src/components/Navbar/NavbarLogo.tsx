import { Box, Typography } from "@mui/material"
import Logo from "../Logo"

const NavbarLogo = () => {
  return (
    <Box display={"flex"} alignItems={'center'} gap={1}>
        <Logo/>
        <Typography 
            variant="subtitle1" 
            fontWeight={'600'}
            display={{xs : 'none',sm : 'inline-flex'}}
            color="text.primary"
        >
            Peta Ilmu Islam
        </Typography>
    </Box>
  )
}

export default NavbarLogo;