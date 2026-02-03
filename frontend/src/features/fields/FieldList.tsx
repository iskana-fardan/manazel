import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material"
import FieldCard from "./FieldCard";
import { fields } from "../../data/fields/index.ts";




const FieldList= () =>{
  const theme = useTheme();
  return (
    <Box
      component="section"
      id="bidang-ilmu"
      sx={{
        py: { xs: 6,sm: 7, md: 9,lg : 11 },
        backgroundColor: theme.palette.background.paper
      }}
      
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Stack spacing={1} textAlign="center" mb={6} >
            <Typography variant="h4" fontSize={{ xs: "1.5rem", sm: "1.9rem" }} fontWeight={700}>
              Bidang-bidang Ilmu
            </Typography>
            <Typography
              variant="body2"
              fontSize={{ xs: "1rem" }}
              color="text.secondary"
            >
              Pilih bidang ilmu untuk menjelajahi jalur pembelajaran yang terstruktur
            </Typography>
        </Stack> 


        {/* Cards */}
        <Grid container spacing={3}>
          {fields.map(({ name,slug, nameArabic, description, icon }, index) => {
            return (
                <Grid
                    key={index}
                    size={{ xs: 12, sm: 6 }} 
                    >
                        <FieldCard 
                            name={name} 
                            slug={slug}
                            nameArabic={nameArabic} 
                            description={description} 
                            icon={icon}
                            />
                </Grid>
                    )
            })}
        </Grid>
      </Container>
    </Box>
  )
}

export default FieldList