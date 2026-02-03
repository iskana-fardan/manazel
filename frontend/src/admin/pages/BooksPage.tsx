import {
  Box,
  Button,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material"

const dummyBooks = [
  { id: 1, title: "Ushul Fiqh", author: "Imam Syafi'i" },
  { id: 2, title: "Tafsir Ibnu Katsir", author: "Ibnu Katsir" },
]

export default function BooksPage() {
  return (
    <Box>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">Books</Typography>
        <Button variant="contained">Add Book</Button>
      </Stack>

      {/* Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Author</TableCell>
            <TableCell width={160}>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {dummyBooks.map(book => (
            <TableRow key={book.id}>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Button size="small">Edit</Button>
                  <Button size="small" color="error">
                    Delete
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}
