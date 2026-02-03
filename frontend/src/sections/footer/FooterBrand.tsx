import { Box, Grid, Stack, Typography } from "@mui/material"
import Logo from "../../components/Logo"

const FooterBrand = () => {
  return (
    <Grid size={{ xs: 12, md: 4 }}>
        <Stack spacing={2}>
            {/* logo */}
            <Stack direction="row" spacing={1.5} alignItems="center">
                <Box display={"flex"} alignItems={'center'}  gap={1}>
                    <Logo/>
                    <Typography 
                        variant="subtitle1" 
                        fontWeight={'600'}
                        color="text.primary"
                    >
                        Peta Ilmu Islam
                    </Typography>
                </Box>
            </Stack>

            {/* Desc */}
             <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
              >
                Panduan terstruktur untuk memetakan jalur belajar kitab
                dan disiplin ilmu Islam berdasarkan tradisi keilmuan ulama.
                Dirancang untuk membantu penuntut ilmu belajar dengan arah dan kejelasan.
              </Typography>
        </Stack>
    </Grid>
  )
}

export default FooterBrand