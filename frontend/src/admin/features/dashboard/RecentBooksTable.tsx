import {
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
import { useBooks } from "../../../hooks/useBooks";

const levelColor = {
  beginner: "success",
  intermediate: "warning",
  advanced: "error",
} as const;

export default function RecentBooksTable() {
  const { data: books = [], isLoading } = useBooks();

  const recent = [...books]
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader title="Recent Books" titleTypographyProps={{ variant: "h6" }} />
      <CardContent sx={{ pt: 0 }}>
        {isLoading ? (
          <Skeleton variant="rectangular" height={200} />
        ) : recent.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            No books yet.
          </Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Field</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recent.map((book) => (
                <TableRow key={book._id} hover>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.field ?? "—"}</TableCell>
                  <TableCell>
                    {book.level ? (
                      <Chip
                        label={book.level}
                        size="small"
                        color={levelColor[book.level as keyof typeof levelColor] ?? "default"}
                      />
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>{book.type ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
