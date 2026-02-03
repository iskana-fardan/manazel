import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { NavLink } from "react-router-dom";

const HeroSection = () => {
  const theme = useTheme();

  const scrollToCategories = () => {
    document
      .getElementById("bidang-ilmu")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box
      component="section"
      sx={{
        width: "100vw",
        minHeight: {
          xs: "77vh",
          md: "88vh",
        },
        display: "flex",
        alignItems: "center",
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Wrapper */}
      <Container
        maxWidth="lg"
        sx={{
          width: "100%",
          mt: { xs: 6, md: 7 },
        }}
      >
        <Stack alignItems="center">
          {/* Title & Subtitle */}
          <Stack
            spacing={{ xs: 1.6, md: 2 }}
            alignItems="center"
            textAlign="center"
          >
            <Typography
              component="h1"
              sx={{
                fontWeight: 800,
                lineHeight: 1.1,
                fontSize: {
                  xs: "1.9rem",
                  sm: "2.3rem",
                  md: "3.1rem",
                  lg: "4rem",
                },
                wordSpacing: "-0.15em",
                letterSpacing: "-0.01em",
                color: "text.primary",
              }}
            >
              Peta Ilmu Islam
            </Typography>

            <Typography
              sx={{
                maxWidth: {
                  xs: 420,
                  sm: 560,
                  md: 680,
                },
                fontSize: {
                  xs: "1rem",
                  sm: "1.2rem",
                  md: "1.4rem",
                },
                lineHeight: 1.35,
                color: "text.secondary",
              }}
            >
              Panduan jalur belajar kitab dan disiplin ilmu Islam
              berbasis tradisi keilmuan ulama.
            </Typography>
          </Stack>

          {/* CTA Buttons */}
          <Stack
            spacing={1.4}
            direction={{ xs: "column", sm: "row" }}
            sx={{
              width: "100%",
              mt: { xs: 3.5, sm: 5 },
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              disableRipple
              variant="contained"
              size="medium"
              onClick={scrollToCategories}
              endIcon={
                <ArrowDownwardIcon
                  sx={{
                    fontSize: { xs: 16, sm: 18 },
                    ml: 0.5,
                  }}
                />
              }
              sx={{
                textTransform: "none",
                borderRadius: "6px",
                py: { xs: 1.2, sm: 1 },
                px: 4,
                minWidth: { xs: "100%", sm: "auto" },
                backgroundColor: theme.palette.teal[100],
                color: "white",
                fontWeight: 500,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: theme.palette.teal[200],
                  boxShadow: "none",
                },
              }}
            >
              Lihat Roadmap Ilmu
            </Button>

            <Button
              disableRipple
              component={NavLink}
              to="/tentang"
              variant="outlined"
              size="medium"
              sx={{
                textTransform: "none",
                borderRadius: "6px",
                py: { xs: 1.2, sm: 1 },
                px: 4,
                minWidth: { xs: "100%", sm: "auto" },
                color: "text.primary",
                border: `1px solid ${theme.palette.divider}`,
                fontWeight: 550,
                "&:hover": {
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: "transparent",
                },
              }}
            >
              Tentang Kami
            </Button>
          </Stack>

          {/* Features */}
          <Grid
            container
            spacing={2}
            sx={{
              mt: {
                xs: 5,
                sm: 6,
                md: 6.2,
                lg: 6.4,
              },
              justifyContent: "center",
            }}
          >
            {[
              "10+ Bidang Ilmu",
              "Kitab Bertahap",
              "Kurasi Tradisi Ulama"
            ].map((item) => (
              <Grid
                key={item}
                size={{ xs:6,sm:"auto" }}
                sx={{
                  display: "flex",
                  justifyContent:"center",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                >
                  <Box
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.teal[100],
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: { xs: "0.95rem", sm: "0.9rem" },
                      color: "text.secondary",
                    }}
                  >
                    {item}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};

export default HeroSection;
