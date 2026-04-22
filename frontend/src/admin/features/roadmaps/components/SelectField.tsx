// import {
//   Box,
//   Stack,
//   Typography,
//   Select,
//   MenuItem,
//   Paper,
//   Button,
//   IconButton,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";

// import { useState, useMemo } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// import api from "../../services/api";
// import AddBookDialog from "./AddBookDialog";
// import type { Book } from "../books/books.types";
// import type { Field } from "../fields/fields.types";

// type Roadmap = {
//   field: string;
//   dars: {
//     beginner: string[];
//     intermediate: string[];
//     advanced: string[];
//   };
//   muthalaah: {
//     recommended: string[];
//   };
// };

// export default function RoadmapPage() {
//   const queryClient = useQueryClient();

//   const [selectedField, setSelectedField] = useState("");
//   const [dialog, setDialog] = useState<{
//     open: boolean;
//     type: "dars" | "muthalaah";
//     level: "beginner" | "intermediate" | "advanced" | "recommended";
//   }>({
//     open: false,
//     type: "dars",
//     level: "beginner",
//   });

//   // 🔥 FETCH FIELDS
//   const { data: fields = [] } = useQuery<Field[]>({
//     queryKey: ["fields"],
//     queryFn: async () => {
//       const { data } = await api.get("/fields");
//       return data;
//     },
//   });

//   // 🔥 FETCH BOOKS
//   const { data: allBooks = [] } = useQuery<Book[]>({
//     queryKey: ["books"],
//     queryFn: async () => {
//       const { data } = await api.get("/books");
//       return data;
//     },
//   });

//   // 🔥 FETCH ROADMAP
//   const { data: roadmap } = useQuery<Roadmap>({
//     queryKey: ["roadmap", selectedField],
//     queryFn: async () => {
//       const { data } = await api.get(`/roadmaps?field=${selectedField}`);
//       return data;
//     },
//     enabled: !!selectedField,
//   });

//   // 🔥 ADD BOOK
//   const addMutation = useMutation({
//     mutationFn: (bookId: string) =>
//       api.post("/roadmaps/add-book", {
//         field: selectedField,
//         type: dialog.type,
//         level: dialog.level,
//         bookId,
//       }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["roadmap", selectedField] });
//       setDialog((p) => ({ ...p, open: false }));
//     },
//   });

//   // 🔥 DELETE BOOK
//   const deleteMutation = useMutation({
//     mutationFn: (payload: {
//       type: string;
//       level: string;
//       bookId: string;
//     }) =>
//       api.delete("/roadmaps/remove-book", { data: { field: selectedField, ...payload } }),

//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["roadmap", selectedField] });
//     },
//   });

//   // 🔁 MAP ID → BOOK OBJECT
//   const mapBooks = (ids: string[]) => {
//     return ids
//       .map((id) => allBooks.find((b) => b._id === id))
//       .filter(Boolean) as Book[];
//   };

//   // 🎯 OPEN DIALOG
//   const handleOpenDialog = (
//     type: "dars" | "muthalaah",
//     level: "beginner" | "intermediate" | "advanced" | "recommended"
//   ) => {
//     setDialog({ open: true, type, level });
//   };

//   // 🧩 RENDER LEVEL
//   const renderLevel = (
//     title: string,
//     ids: string[],
//     type: "dars" | "muthalaah",
//     level: any
//   ) => {
//     const books = mapBooks(ids);

//     return (
//       <Paper sx={{ p: 2 }}>
//         <Stack spacing={2}>
//           <Typography fontWeight="bold">
//             {title} ({books.length})
//           </Typography>

//           {books.length === 0 ? (
//             <Typography color="text.secondary">
//               No books added yet
//             </Typography>
//           ) : (
//             books.map((book, index) => (
//               <Stack
//                 key={book._id}
//                 direction="row"
//                 justifyContent="space-between"
//                 alignItems="center"
//               >
//                 <Box>
//                   <Typography>
//                     {index + 1}. {book.title}
//                   </Typography>
//                   <Typography variant="caption" color="text.secondary">
//                     {book.author}
//                   </Typography>
//                 </Box>

//                 <IconButton
//                   color="error"
//                   onClick={() =>
//                     deleteMutation.mutate({
//                       type,
//                       level,
//                       bookId: book._id,
//                     })
//                   }
//                 >
//                   <DeleteIcon />
//                 </IconButton>
//               </Stack>
//             ))
//           )}

//           <Button
//             size="small"
//             onClick={() => handleOpenDialog(type, level)}
//           >
//             + Add Book
//           </Button>
//         </Stack>
//       </Paper>
//     );
//   };

//   return (
//     <Box p={3}>
//       <Stack spacing={3}>
//         <Typography variant="h5">Roadmaps Management</Typography>

//         {/* SELECT FIELD */}
//         <Select
//           value={selectedField}
//           onChange={(e) => setSelectedField(e.target.value)}
//           displayEmpty
//         >
//           <MenuItem value="" disabled>
//             Select Field
//           </MenuItem>

//           {fields.map((f) => (
//             <MenuItem key={f._id} value={f.name}>
//               {f.slug}
//             </MenuItem>
//           ))}
//         </Select>

//         {/* CONTENT */}
//         {roadmap && (
//           <>
//             {/* DARS */}
//             <Stack spacing={2}>
//               <Typography variant="h6">Dars</Typography>

//               {renderLevel(
//                 "Beginner",
//                 roadmap.dars.beginner,
//                 "dars",
//                 "beginner"
//               )}
//               {renderLevel(
//                 "Intermediate",
//                 roadmap.dars.intermediate,
//                 "dars",
//                 "intermediate"
//               )}
//               {renderLevel(
//                 "Advanced",
//                 roadmap.dars.advanced,
//                 "dars",
//                 "advanced"
//               )}
//             </Stack>

//             {/* MUTHALAAH */}
//             <Stack spacing={2}>
//               <Typography variant="h6">Muthalaah</Typography>

//               {renderLevel(
//                 "Recommended",
//                 roadmap.muthalaah.recommended,
//                 "muthalaah",
//                 "recommended"
//               )}
//             </Stack>
//           </>
//         )}

//         {/* DIALOG */}
//         <AddBookDialog
//           open={dialog.open}
//           onClose={() => setDialog((p) => ({ ...p, open: false }))}
//           onSubmit={(bookId) => addMutation.mutate(bookId)}
//           allBooks={allBooks}
//           roadmapBooks={
//             dialog.type === "dars"
//               ? roadmap?.dars?.[dialog.level as keyof typeof roadmap.dars] || []
//               : roadmap?.muthalaah?.recommended || []
//           }
//           field={selectedField}
//           type={dialog.type}
//           level={dialog.level}
//         />
//       </Stack>
//     </Box>
//   );
// }