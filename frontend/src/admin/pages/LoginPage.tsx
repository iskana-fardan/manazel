import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../services/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // mencegah reload
        setError("");
        setLoading(true);

        try {
            await api.post("/auth/login", { email, password });
            navigate("/admin", { replace: true });
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message ?? "Login failed");
            } else {
                setError("Unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }   
  };


  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.main}22, ${theme.palette.background.default})`,
      }}
    >
      <Card sx={{ width: 400, borderRadius: 2, boxShadow: 6 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
            Admin Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 2, py: 1.2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={22} /> : "Login"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
