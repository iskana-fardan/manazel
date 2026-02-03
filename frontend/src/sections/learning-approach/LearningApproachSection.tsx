import Grid from "@mui/material/Grid"
import { Container, Box, Stack, Typography, useTheme } from "@mui/material"
import { LuBookOpen, LuLayers, LuShieldCheck } from "react-icons/lu"

const approaches = [
  {
    title: "Kitab Dars",
    description:
      "Kitab-kitab utama yang dipelajari secara bertahap bersama guru,disusun dari tingkat dasar hingga lanjutan sesuai tradisi keilmuan.",
    icon: LuBookOpen,
  },
  {
    title: "Kitab Muthala'ah",
    description:
      "Bacaan pengayaan untuk memperluas wawasan dan pendalaman ilmu,dapat dibaca secara fleksibel sesuai kebutuhan dan minat.",
    icon: LuLayers,
  },
  {
    title: "Panduan Kurasi Kitab",
    description:
      "Rekomendasi kitab dan cetakan yang diseleksi dengan cermat,berdasarkan metodologi ulama dan tradisi keilmuan Islam.",
    icon: LuShieldCheck,
  },
]


const LearningApproachSection = () => {
    const theme = useTheme();
  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={9} justifyContent={"center"} >
          {approaches.map((item,index) => {
            const Icon = item.icon;

            const size = index === 2 
                        ? { xs: 12, sm: 12, md: 4 } // Curated Guidance full di SM
                        : { xs: 12, sm: 6, md: 4 }
            return (
            <Grid key={item.title} size={size} >
              <Stack spacing={2} alignItems="center" textAlign="center">
                    <Stack
                            alignItems="center"
                            justifyContent="center"
                            sx={{
                                width: 50,
                                height: 50,
                                borderRadius: "50%",
                                backgroundColor: "rgba(255,255,255,0.06)", // subtle
                                color: theme.palette.teal[200],
                                fontSize: "24px",
                                fontWeight: 900
                            }}
                        >
                            <Icon/>
                    </Stack>

                    <Stack spacing={1} alignItems={"center"}>
                            <Typography fontWeight={600}>
                                {item.title}
                            </Typography>

                            <Typography color="text.secondary">
                            {item.description}
                            </Typography>
                    </Stack>                                                
                </Stack>
            </Grid>
            )
        })}
        </Grid>
      </Container>
    </Box>
  )
}

export default LearningApproachSection
