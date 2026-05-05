import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Box
      component="main"
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <Typography variant="h1" fontWeight={800} color="text.disabled" fontSize="6rem">
          404
        </Typography>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Halaman tidak ditemukan
        </Typography>
        <Typography color="text.secondary" mb={4}>
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/")}>
          Kembali ke Beranda
        </Button>
      </Container>
    </Box>
  );
}
