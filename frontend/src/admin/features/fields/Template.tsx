// import { Box, Stack } from "@mui/material";
// import FieldHeader from "./FieldHeader";
// import FieldsTable from "./FieldsTable";
// import FieldDialog from "./FieldDialog";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import api from "../../services/api";
// import type { Field } from "./fields.types";
// import { useState } from "react";

// const FieldsPage = () => {
//   const queryClient = useQueryClient();

//   const [open, setOpen] = useState(false);
//   const [selected, setSelected] = useState<Field | null>(null);

//   const { data = [] } = useQuery<Field[]>({
//     queryKey: ["fields"],
//     queryFn: async () => {
//       const { data } = await api.get("/fields");
//       return data;
//     },
//   });

//   const createMutation = useMutation({
//     mutationFn: (newField: Partial<Field>) =>
//       api.post("/fields", newField),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["fields"] });
//       setOpen(false);
//     },
//   });

//   const updateMutation = useMutation({
//     mutationFn: (updated: Partial<Field>) =>
//       api.put(`/fields/${selected?._id}`, updated),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["fields"] });
//       setOpen(false);
//       setSelected(null);
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (id: string) =>
//       api.delete(`/fields/${id}`),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["fields"] });
//     },
//   });

//   const handleSubmit = (form: Partial<Field>) => {
//     if (selected) {
//       updateMutation.mutate(form);
//     } else {
//       createMutation.mutate(form);
//     }
//   };

//   const handleDelete = (field: Field) => {
//     const confirmDelete = window.confirm(
//       `Are you sure you want to delete "${field.name}"?`
//     );
//     if (confirmDelete) {
//       deleteMutation.mutate(field._id);
//     }
//   };

//   return (
//     <Box sx={{ width: "100%", p: 3 }}>
//       <Stack spacing={3}>
//         <FieldHeader onAdd={() => {
//           setSelected(null);
//           setOpen(true);
//         }} />

//         <FieldsTable
//           fields={data}
//           onEdit={(field) => {
//             setSelected(field);
//             setOpen(true);
//           }}
//           onDelete={handleDelete}
//         />

//         <FieldDialog
//           open={open}
//           onClose={() => {
//             setOpen(false);
//             setSelected(null);
//           }}
//           onSubmit={handleSubmit}
//           initialData={selected}
//         />
//       </Stack>
//     </Box>
//   );
// };

// export default FieldsPage;
