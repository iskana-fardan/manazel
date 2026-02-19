import { Box, Stack } from "@mui/material";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import FieldHeader from "./FieldHeader";
import FieldsTable from "./FieldsTable";
import FieldDialog from "./FieldDialog";
import api from "../../services/api";
import type { Field } from "./fields.types";
import type { FieldFormValues } from "./field.schema";

export default function FieldsPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Field | null>(null);

  const { data = [] } = useQuery<Field[]>({
    queryKey: ["fields"],
    queryFn: async () => {
      const { data } = await api.get("/fields");
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: FieldFormValues) =>
      api.post("/fields", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fields"] });
      setOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: FieldFormValues) =>
      api.put(`/fields/${selected?._id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fields"] });
      setOpen(false);
      setSelected(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/fields/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fields"] });
    },
  });

  const handleSubmit = (data: FieldFormValues) => {
    if (selected) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Box p={3}>
      <Stack spacing={3}>
        <FieldHeader
          onAdd={() => {
            setSelected(null);
            setOpen(true);
          }}
        />

        <FieldsTable
          fields={data}
          onEdit={(field) => {
            setSelected(field);
            setOpen(true);
          }}
          onDelete={(field) => {
            if (confirm(`Delete ${field.name}?`)) {
              deleteMutation.mutate(field._id);
            }
          }}
        />

        <FieldDialog
          open={open}
          onClose={() => {
            setOpen(false);
            setSelected(null);
          }}
          onSubmit={handleSubmit}
          initialData={selected}
          loading={
            createMutation.isPending || updateMutation.isPending
          }
        />
      </Stack>
    </Box>
  );
}







// import { Box, Stack } from "@mui/material";
// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import FieldHeader from "./FieldHeader";
// import FieldsTable from "./FieldsTable";
// import FieldDialog from "./FieldDialog";
// import api from "../../services/api";
// import type { Field } from "./fields.types";
// import type { FieldFormValues } from "./field.schema";

// export default function FieldsPage() {
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
//     mutationFn: (payload: FieldFormValues) =>
//       api.post("/fields", payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["fields"] });
//       setOpen(false);
//     },
//   });

//   const updateMutation = useMutation({
//     mutationFn: (payload: FieldFormValues) =>
//       api.put(`/fields/${selected?._id}`, payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["fields"] });
//       setOpen(false);
//       setSelected(null);
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (id: string) => api.delete(`/fields/${id}`),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["fields"] });
//     },
//   });

//   const handleSubmit = (data: FieldFormValues) => {
//     if (selected) {
//       updateMutation.mutate(data);
//     } else {
//       createMutation.mutate(data);
//     }
//   };

//   return (
//     <Box p={3}>
//       <Stack spacing={3}>
//         <FieldHeader
//           onAdd={() => {
//             setSelected(null);
//             setOpen(true);
//           }}
//         />

//         <FieldsTable
//           fields={data}
//           onEdit={(field) => {
//             setSelected(field);
//             setOpen(true);
//           }}
//           onDelete={(field) => {
//             if (confirm(`Delete ${field.name}?`)) {
//               deleteMutation.mutate(field._id);
//             }
//           }}
//         />

//         <FieldDialog
//           open={open}
//           onClose={() => {
//             setOpen(false);
//             setSelected(null);
//           }}
//           onSubmit={handleSubmit}
//           initialData={selected}
//           loading={
//             createMutation.isPending || updateMutation.isPending
//           }
//         />
//       </Stack>
//     </Box>
//   );
// }
