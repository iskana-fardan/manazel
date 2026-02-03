import { IconButton, Stack, Typography } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { NavLink } from 'react-router-dom';

const Title = () => {
  return (
    <>
    <Stack spacing={3} mt={11} mx={1} py={2}>
        {/* Back */}
        <IconButton
          disableRipple
          sx={{ 
            alignSelf: "flex-start", 
            alignItems: "center",
            fontSize: "18px", 
            borderRadius: "5px",
            "&:hover": {
                backgroundColor: "rgba(100,100,100,0.1)",
                color:"text.primary"
            },
          }}
          component={NavLink}
          to={"/"}
        >
          <ArrowBackRoundedIcon fontSize='inherit' />
          <Typography ml={1.2} fontSize= "0.75rem">
            Kembali ke Beranda
          </Typography>
        </IconButton>
    </Stack>
    <Stack spacing={2} sx={{mb:6}}>
          <Typography variant="h4" fontWeight={600} color="text.primary"> 
              Tentang Peta Ilmu Islam
          </Typography>
          <Typography color="text.secondary" fontSize={"1.2rem"}>
              Panduan terstruktur untuk menapaki kurikulum keilmuan Islam
              berdasarkan tradisi ulama.
          </Typography>
    </Stack>
    </>
  )
}

export default Title