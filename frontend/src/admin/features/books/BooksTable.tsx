import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import type { Book } from "../../../types/api";

type BooksTableProps = {
  books?: Book[];
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
};

const BooksTable = ({ books = [], onEdit, onDelete }: BooksTableProps) => {
  const columns: GridColDef[] = [
    { field: "title", headerName: "Title", flex:1 },
    { field: "titleArabic", headerName: "Arabic Title", flex: 1 },
    { field: "author", headerName: "Author", flex: 1 },
    { field: "field", headerName: "Field", flex: 1 },
    { field: "level", headerName: "Level", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => {
            onEdit(params.row)
          }}>
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => onDelete(params.row)}
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box>
      <DataGrid
        autoHeight
        rows={books.map(item => ({
          id: item._id,
          ...item,
        }))}
        columns={columns}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
        disableColumnResize
        disableColumnMenu
        disableColumnSorting
      />
    </Box>
  );
};

export default BooksTable;
