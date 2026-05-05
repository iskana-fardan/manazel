import {
  Box,
  Button,
  Container,
  IconButton,
  Skeleton,
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

import { useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { useRoadmap } from "../../hooks/useRoadmap";
import { useBooks } from "../../hooks/useBooks";
import { getBooksForLevel, getBooksForMuthalaah } from "../../services/roadmaps.api";

function RoadmapSkeleton() {
  return (
    <Box component="main">
      <Container maxWidth="md" sx={{ pt: 3 }}>
        <Stack spacing={{ xs: 2.2, sm: 3 }} mt={{ xs: 8, sm: 10, md: 11 }}>
          <Skeleton variant="rounded" width={160} height={30} />
          <Stack direction="row" spacing={2} alignItems="center">
            <Skeleton variant="rounded" width={48} height={48} sx={{ borderRadius: "8px" }} />
            <Stack spacing={0.5}>
              <Skeleton variant="text" width={200} height={28} />
              <Skeleton variant="text" width={140} height={20} />
            </Stack>
          </Stack>
          <Skeleton variant="text" width="75%" height={20} />
        </Stack>
      </Container>
      <Container maxWidth="md" sx={{ mt: 3, mb: 6 }}>
        <Skeleton variant="rounded" height={64} sx={{ borderRadius: 1 }} />
      </Container>
      <Container maxWidth="md">
        <Skeleton variant="text" width={160} height={32} sx={{ mb: 1 }} />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rounded" height={72} sx={{ mb: 1, borderRadius: 1 }} />
        ))}
      </Container>
    </Box>
  );
}

const RoadmapDetailPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { slug } = useParams();

  const { data: roadmap, isLoading: roadmapLoading } = useRoadmap(slug!);
  const { data: allBooks = [], isLoading: booksLoading } = useBooks();

  const booksMap = useMemo(
    () => new Map(allBooks.map((b) => [b._id, b])),
    [allBooks]
  );

  const beginnerBooks = useMemo(
    () => (roadmap ? getBooksForLevel(roadmap, "beginner", booksMap) : []),
    [roadmap, booksMap]
  );
  const intermediateBooks = useMemo(
    () => (roadmap ? getBooksForLevel(roadmap, "intermediate", booksMap) : []),
    [roadmap, booksMap]
  );
  const advancedBooks = useMemo(
    () => (roadmap ? getBooksForLevel(roadmap, "advanced", booksMap) : []),
    [roadmap, booksMap]
  );
  const muthalaahBooks = useMemo(
    () => (roadmap ? getBooksForMuthalaah(roadmap, booksMap) : []),
    [roadmap, booksMap]
  );

  const backToCategories = () => {
    navigate("/", { state: { scrollTo: "bidang-ilmu" } });
  };

  if (roadmapLoading || booksLoading) return <RoadmapSkeleton />;

  if (!roadmap) {
    return (
      <Box
        component="main"
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="sm" sx={{ textAlign: "center" }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Roadmap tidak ditemukan
          </Typography>
          <Typography color="text.secondary" mb={3}>
            Jalur belajar untuk bidang ini belum tersedia.
          </Typography>
          <Button variant="contained" onClick={backToCategories}>
            Lihat Bidang Ilmu Lainnya
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box component="main">
      {/* ===== HEADER ===== */}
      <Container maxWidth="md" sx={{ pt: 3 }}>
        <Stack
          spacing={{ xs: 2.2, sm: 3 }}
          mt={{ xs: 8, sm: 10, md: 11 }}
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
            <Box
              sx={{
                width: { xs: 44, sm: 48 },
                height: { xs: 44, sm: 48 },
                borderRadius: "8px",
                bgcolor: theme.palette.teal[100],
                color: "common.white",
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
