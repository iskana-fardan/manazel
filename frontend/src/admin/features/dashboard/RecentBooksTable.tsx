import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { Link } from "react-router-dom";
import { useBooks } from "../../../hooks/useBooks";

const LEVEL_COLOR: Record<string, string> = {
  beginner:     "#22c55e",
  intermediate: "#3b82f6",
  advanced:     "#a855f7",
};

const HEAD_CELLS = ["Title", "Author", "Field", "Level", "Type"];

export default function RecentBooksTable() {
  const { data: books = [], isLoading } = useBooks();

  const recent = [...books]
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
    )
    .slice(0, 5);

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader
        title={
          <Typography variant="subtitle1" fontWeight={600}>
            Recent Books
          </Typography>
        }
        action={
          <Button component={Link} to="/admin/books" size="small">
            View all
          </Button>
        }
        sx={{ pb: 0 }}
      />

      <CardContent sx={{ pt: 1.5, px: 0, "&:last-child": { pb: 0 } }}>
        {isLoading ? (
          <Box sx={{ px: 3 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="text" height={46} sx={{ mb: 0.5 }} />
            ))}
          </Box>
        ) : recent.length === 0 ? (
          <Box
            sx={{
              py: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <AutoStoriesIcon sx={{ fontSize: 40, color: "text.disabled" }} />
            <Typography variant="body2" color="text.disabled">
              No books yet.
            </Typography>
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    bgcolor: (t) => alpha(t.palette.text.primary, 0.03),
                    color: "text.secondary",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: 0.6,
                  },
                }}
              >
                {HEAD_CELLS.map((h) => (
                  <TableCell key={h}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {recent.map((book) => {
                const levelColor = LEVEL_COLOR[book.level ?? ""] ?? null;
                return (
                  <TableRow
                    key={book._id}
                    sx={{
                      "&:hover": {
                        bgcolor: (t) => alpha(t.palette.text.primary, 0.03),
                      },
                      "&:last-child td": { border: 0 },
                      "& td": { py: 1.2 },
                    }}
                  >
                    <TableCell sx={{ maxWidth: 160 }}>
                      <Typography variant="body2" fontWeight={500} noWrap>
                        {book.title}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ maxWidth: 120 }}>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {book.author}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {book.field ?? "—"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {levelColor ? (
                        <Chip
                          label={book.level}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            bgcolor: alpha(levelColor, 0.12),
                            color: levelColor,
                            border: "none",
                          }}
                        />
                      ) : (
                        <Typography variant="body2" color="text.disabled">
                          —
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {book.type ?? "—"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
