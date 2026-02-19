import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import type { Field } from "./fields.types";

type FieldsTableProps = {
  fields?: Field[];
  onEdit: (field: Field) => void;
  onDelete: (field: Field) => void;
};

const FieldsTable = ({ fields = [], onEdit, onDelete }: FieldsTableProps) => {
  const columns: GridColDef[] = [
    { field: "order", headerName: "Order", width: 80 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "nameArabic", headerName: "Arabic Name", flex: 1 },
    { field: "slug", headerName: "Slug", flex: 1 },
    { field: "icon", headerName: "Icon", flex: 1 },
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
        rows={fields.map(item => ({
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

export default FieldsTable;
