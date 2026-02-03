import {
  Box,
  Container,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import BookOutlinedIcon from "@mui/icons-material/BookOutlined";

import RoadmapLevel from "./RoadmapLevel";
import KitabMuthalaahCard from "./KitabMuthalaahCards";

import { getFieldBySlug } from "../../data/fields";
import { getRoadmapByFieldId } from "../../data/roadmaps";
import {
  getBooksByLevel,
  getMuthalaahBooks,
} from "../../data/roadmapHelpers";

import { useLocation, useNavigate, useParams } from "react-router-dom";

const RoadmapDetailPage = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();

  const backToCategories = () => {
    const scrollToAnchor = () => {
      document
        .getElementById("categories")
        ?.scrollIntoView({ behavior: "smooth" });
    };

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(scrollToAnchor, 150);
    } else {
      scrollToAnchor();
    }
  };

  const field = getFieldBySlug(slug);
  const roadmap = getRoadmapByFieldId(field?.id);

  const beginnerBooks = getBooksByLevel(roadmap, "beginner");
  const intermediateBooks = getBooksByLevel(roadmap, "intermediate");
  const advancedBooks = getBooksByLevel(roadmap, "advanced");

  const muthalaahBooks = getMuthalaahBooks(roadmap);

  if (!roadmap) return null;

  return (
    <Box component="main">
      {/* ===== HEADER ===== */}
      <Container maxWidth="md">
        <Stack
          spacing={{ xs: 2.2, sm: 3 }}
          mt={{ xs: 8, sm: 10, md: 11 }} // 👈 FIX JARAK NAVBAR (mobile lebih rapet)
          mx={1}
          py={2}
        >
          {/* Back Button */}
          <IconButton
            disableRipple
            onClick={backToCategories}
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
              Kembali ke beranda
            </Typography>
          </IconButton>

          {/* Title */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
          >
            {/* Logo / Icon */}
            <Box
              sx={{
                width: { xs: 44, sm: 48 }, // 👈 JAGA SUPAYA GA TERLALU KECIL
                height: { xs: 44, sm: 48 },
                borderRadius: "8px",
                bgcolor: theme.palette.teal[100],
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <MenuBookRoundedIcon
                sx={{ fontSize: { xs: 22, sm: 24 } }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: {
                    xs: "1.35rem",
                    sm: "1.6rem",
                  },
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                {roadmap.title}{" "}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                mt={0.3}
              >
                {roadmap.titleArabic}
              </Typography>
            </Box>
          </Stack>

          {/* Description */}
          <Typography
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            {`Jalur belajar ${roadmap.title} dari tingkat dasar hingga lanjutan
berdasarkan tradisi keilmuan ulama.`}
          </Typography>
        </Stack>
      </Container>

      {/* ===== ROADMAP INFO ===== */}
      <Container maxWidth="md">
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 6,
            borderRadius: 1,
            bgcolor: theme.palette.background.paper,
            border: "1px solid rgba(20,184,166,0.25)",
          }}
        >
          <Stack direction="row" spacing={2}>
            <InfoOutlinedIcon
              sx={{
                color: theme.palette.teal[100],
                mt: 0.3,
              }}
            />
            <Box sx={{ display: "flex", gap: 0.6, flexDirection: "column" }}>
              <Typography fontWeight={600}>
                Cara menggunakan roadmap ini
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Typography component="span" fontWeight={600}>
                  Kitab Dars{" "}
                </Typography>
                dipelajari secara bertahap bersama guru sebagai jalur utama pembelajaran.
                <Typography component="span" fontWeight={600}>
                  Kitab Muthala'ah{" "}
                </Typography>
                digunakan sebagai bacaan pengayaan dan pendalaman materi.
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Container>

      {/* ===== KITAB PELAJARAN ===== */}
      <Container maxWidth="md">
        <Stack mb={2} direction="row" gap={2} alignItems="center">
          <MenuBookOutlinedIcon sx={{ color: theme.palette.teal[100] }} />
          <Stack>
            <Typography variant="h6" fontWeight={700}>
              Kitab Dars
            </Typography>
            <Typography color="text.secondary">
            Jalur belajar utama. Klik kitab untuk melihat penjelasan lengkap, cetakan yang direkomendasikan, dan referensi belajar.
            </Typography>
          </Stack>
        </Stack>

        <Stack spacing={1}>
          <RoadmapLevel
            books={beginnerBooks}
            title="Tingkat Dasar"
            color={theme.palette.level.beginner}
          />
          <RoadmapLevel
            books={intermediateBooks}
            title="Tingkat Menengah"
            color={theme.palette.level.intermediate}
          />
          <RoadmapLevel
            books={advancedBooks}
            title="Tingkat Lanjutan"
            color={theme.palette.level.advanced}
          />
        </Stack>
      </Container>

      {/* ===== KITAB MUTHALA'AH ===== */}
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Stack mb={2} direction="row" gap={2} alignItems="center">
          <BookOutlinedIcon sx={{ color: theme.palette.teal[100] }} />
          <Stack>
            <Typography variant="h6" fontWeight={700}>
              Kitab Muthala'ah
            </Typography>
            <Typography color="text.secondary">
              Bacaan pengayaan dan pendalaman. Klik kitab untuk melihat penjelasan dan referensi pendukung
            </Typography>
          </Stack>
        </Stack>

        <KitabMuthalaahCard books={muthalaahBooks} />
      </Container>
    </Box>
  );
};

export default RoadmapDetailPage;
