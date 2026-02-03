import { Divider, Grid, Typography, useTheme } from '@mui/material'

const Bottom = () => {
    const theme = useTheme();
  return (
   <Grid size={12}>
        <Divider sx={{borderColor: theme.palette.divider ,width: "100%" }}/>

        <Typography
          variant="body2"
          align="center"
          sx={{ color: "text.secondary",pt: {xs: 3.2, md:3.5 }, pb: {xs: 2 , md:3.5 } }}
        >
          © Peta Ilmu Islam — Menata Ilmu, Menjaga Tradisi
        </Typography>
   </Grid>
  )
}

export default Bottom