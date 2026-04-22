import { Box, MenuItem, Select, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useFields } from "../../../hooks/useFields";
import { getBooksByField, getBooksByLevel } from "../../../services/books.api";
import { useBooks } from "../../../hooks/useBooks";



const RoadmapsPage = () => {
  const [selectedField, setSelectedField] = useState("");


  const { data: fields = [] } = useFields();
  const { data: books = [] } = useBooks();



  const fieldBooks = selectedField ? getBooksByField(books, selectedField) : [];
  // beginner books by field
  // const beginnerField = getBooksByLevel(fieldBooks, "beginner");
  // console.log("beginner")
  // console.log(beginnerField)

  // // intermediate books by field
  // const intermediateField = getBooksByLevel(fieldBooks, "intermediate");
  // console.log("intermediate")
  // console.log(intermediateField)


  // advanced books by field
  const advancedField = getBooksByLevel(fieldBooks, "advanced");
  console.log("advanced")
  console.log(advancedField)




  return (
    <Box p={3}>
        <Stack spacing={3}>
            {/* HEADER */}
            <Typography  sx={{ fontSize: '2rem' }}>
                Roadmaps Management
            </Typography>
            <Typography sx={{ color:'gray' }}>
                Organize learning paths for each field.
            </Typography>


            {/* SELECT FIELD */}
            <Select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select Field
              </MenuItem>

              {fields.map((f) => (
                <MenuItem key={f._id} value={f.slug}>{f.slug}</MenuItem>
              ))}
            </Select>



            

        </Stack>

        
    </Box>
  )
}

export default RoadmapsPage;





// // RoadmapPage (controller)
// //  ├── FieldSelect
// //  ├── RoadmapSection (Dars / Muthalaah)
// //  │     ├── LevelSection
// //  │     │     ├── BookList
// //  │     │     └── AddBookButton
// //  └── AddBookDialog












// TITIPPPP



// import { Box, MenuItem, Select, Stack, Typography } from "@mui/material";
// import { useState } from "react";
// import { useFields } from "../../../hooks/useFields";
// // import type { Roadmap } from "./roadmap.types";
// // import type { Book } from "../books/books.types";





// const RoadmapsPage = () => {
//   const [selectedField, setSelectedField] = useState("");
//   // const [dialogOpen, setDialogOpen] = useState(false);



//   // fetch books 
//   // const { data: allBooks = [] } = useQuery<Book[]>({
//   //   queryKey: ["books"],
//   //   queryFn: async () => {
//   //     const { data } = await api.get("/books");
//   //     return data;
//   //   }
//   // })


  

//   // fetch fields
//   // const { data: fields = [] } = useQuery<Field[]>({
//   //   queryKey: ["fields"],
//   //   queryFn: async () => {
//   //     const { data } = await api.get("/fields");
//   //     return data;
//   //   }
//   // });


//   const { data: fields = [] } = useFields();




//   // fetch roadmap
//   // const { data: roadmap } =  useQuery<Roadmap>({
//   //   queryKey: ["roadmap", "selectedField"],
//   //   queryFn: async () => {
//   //     const { data } = await api.get(`/roadmaps?field=${selectedField}`);
//   //     return data;
//   //   },
//   //   enabled: !!selectedField
//   // })

//   // const beginnerLevel = roadmap?.levels.find((l) => l.slug === "beginner");


//   // map id -> book object
//   // const mapBooks = (ids: string[]) => {
//   //   return ids
//   //     .map((id) => allBooks.find((b)=> b._id === id))
//   // }

//   // // render level
//   // const renderLevel = (
//   //   title: string,
//   //   ids: string[],
//   //   type: "dars" | "muthalaah",
//   //   level: "beginner" | "intermediate" | "advanced"
//   // ) => {
//   //   const books = mapBooks(ids);

//   //   return (
//   //     <Paper sx={{ p: 2 }}>
//   //       <Stack spacing={2}>
//   //         <Typography fontWeight={"bold"}>
//   //           {title} ({books.length})
//   //         </Typography>

//   //         {books.length === 0 ? (
//   //           <Typography color="text.secondary">
//   //             No books added yet
//   //           </Typography>
//   //         ) : (
//   //           books.map((book, index) => (
//   //               <Stack
//   //               key={book._id}
//   //               direction="row"
//   //               justifyContent="space-between"
//   //               alignItems="center"
//   //             >
//   //               <Box>
//   //                 <Typography>
//   //                   {index + 1}. {book.title}
//   //                 </Typography>
//   //                 <Typography variant="caption" color="text.secondary">
//   //                   {book.author}
//   //                 </Typography>
//   //               </Box>

//   //               <IconButton
//   //                 color="error"
//   //                 onClick={() =>
//   //                   deleteMutation.mutate({
//   //                     type,
//   //                     level,
//   //                     bookId: book._id,
//   //                   })
//   //                 }
//   //               >
//   //                 <DeleteIcon />
//   //               </IconButton>
//   //             </Stack>
//   //           ))
//   //         ) }


//   //       </Stack>
//   //     </Paper>
//   //   )



//   // }


//   return (
//     <Box p={3}>
//         <Stack spacing={3}>
//             {/* HEADER */}
//             <Typography  sx={{ fontSize: '2rem' }}>
//                 Roadmaps Management
//             </Typography>
//             <Typography sx={{ color:'gray' }}>
//                 Organize learning paths for each field.
//             </Typography>


//             {/* SELECT FIELD */}
//             <Select
//               value={selectedField}
//               onChange={(e) => setSelectedField(e.target.value)}
//               displayEmpty
//             >
//               <MenuItem value="" disabled>
//                 Select Field
//               </MenuItem>

//               {fields.map((f) => (
//                 <MenuItem key={f._id} value={f.name}>{f.slug}</MenuItem>
//               ))}
//             </Select>



            

//         </Stack>

        
//     </Box>
//   )
// }

// export default RoadmapsPage;





// // // RoadmapPage (controller)
// // //  ├── FieldSelect
// // //  ├── RoadmapSection (Dars / Muthalaah)
// // //  │     ├── LevelSection
// // //  │     │     ├── BookList
// // //  │     │     └── AddBookButton
// // //  └── AddBookDialog





