import { Avatar, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import { GitHub, Instagram, Language } from "@mui/icons-material";
import { Edit, Delete } from "@mui/icons-material";
import type { Contributor } from "../../../types/api";

type ContributorsTableProps = {
  contributors?: Contributor[];
  onEdit: (contributor: Contributor) => void;
  onDelete: (contributor: Contributor) => void;
};

const ContributorsTable = ({ contributors = [], onEdit, onDelete }: ContributorsTableProps) => {
  const columns: GridColDef[] = [
    { field: "name", 
      headerName: "Contributor", 
      flex: 1,
      renderCell : (params) => {
        const row = params.row as Contributor;

        return (
          <Stack direction={"row"} spacing={1} alignItems={"center"}>
            <Avatar
                src={row.avatar || ""}
                sx={{ width: 32, height: 32 }}
            >
              {row.name?.charAt(0).toLocaleUpperCase()}
            </Avatar>

            <Typography variant="body2">
              {row.name}
            </Typography>
          </Stack>
        )
      }


     },
    { field: "role", headerName: "Role", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "socials",
      headerName: "Social Links",
      flex: 1,
      renderCell: (params) => {
        const socials = params.row.socials as Contributor["socials"];

        return (
          <Box display="flex" gap={1}>
            {socials.github && (
              <IconButton
                size="small"
                component="a"
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHub fontSize="small" />
              </IconButton>
            )}
            {socials.instagram && (
              <IconButton
                size="small"
                component="a"
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram fontSize="small" />
              </IconButton>
            )}
            {socials.website && (
              <IconButton
                size="small"
                component="a"
                href={socials.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Language fontSize="small" />
              </IconButton>
            )}
          </Box>
          );
        },
      },
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
        rows={contributors.map(item => ({
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

export default ContributorsTable;
