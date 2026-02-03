import {
  Box,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material"
import CollaboratorCard from "./CollaboratorCard"
import { collaborators } from "./collaborators.data"
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded"
import { NavLink } from "react-router-dom"
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined"

export default function CollaboratorsSection() {
  const theme = useTheme()

  return (
    <Box>
      <Container maxWidth="lg" sx={{ pt: 3 }}>
        {/* Back */}
        <Stack spacing={3} mt={{ xs: 7, md: 9 }} mx={1} py={2}>
          <IconButton
            disableRipple
            component={NavLink}
            to="/"
            sx={{
              alignSelf: "flex-start",
              borderRadius: "6px",
              px: 1,
              py: 0.6,
              "&:hover": {
                backgroundColor: "rgba(100,100,100,0.1)",
              },
            }}
          >
            <ArrowBackRoundedIcon fontSize="small" />
            <Typography ml={1} fontSize="0.8rem">
              Kembali ke Beranda
            </Typography>
          </IconButton>
        </Stack>

        {/* Title */}
        <Stack spacing={1.4} textAlign="center" mb={{ xs: 5, md: 7 }}>
          <Typography
            sx={{
              fontSize: { xs: "1.9rem", md: "2.4rem" },
              fontWeight: 800,
            }}
          >
            Para Kontributor
          </Typography>
          <Typography color="text.secondary">
            Proyek ini dikembangkan bersama para penuntut ilmu dan kontributor
            yang peduli terhadap keberlangsungan tradisi keilmuan Islam.
          </Typography>

          <Typography color="text.secondary">
            Setiap kontribusi yang diberikan—baik dalam bentuk penulisan, peninjauan,
            maupun pengembangan teknis—merupakan bagian dari ikhtiar kolektif
            untuk menghadirkan peta belajar yang lebih terarah dan bermanfaat.
          </Typography>

          <Typography color="text.secondary">
            Ini adalah inisiatif independen yang dibangun atas semangat berbagi ilmu
            dan saling menasihati dalam kebaikan.
          </Typography>
        </Stack>

        {/* Cards Grid */}
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {collaborators.map((item) => (
            <Grid size={{ xs:12, sm:6,md:3}} key={item.id}>
              <CollaboratorCard data={item} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Thank You Box */}
      <Container maxWidth="md" sx={{ pb: 10 }}>
        <Box
          sx={{
            mt: 8,
            p: { xs: 3, md: 5 },
            textAlign: "center",
            borderRadius: "18px",
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ color: theme.palette.teal[100], mb: 1 }}>
            <FavoriteBorderOutlinedIcon fontSize="large" />
          </Box>
          <Typography fontWeight={600}>
            Terima kasih kepada seluruh kontributor
            yang telah meluangkan waktu, tenaga, dan ilmunya
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Semoga setiap kontribusi yang diberikan
            dicatat sebagai amal jariyah dan diberkahi oleh Allah Ta‘ala.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
