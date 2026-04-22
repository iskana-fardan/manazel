// import { useMutation, useQueryClient } from "@tanstack/react-query"
// import { createBook } from "../services/books.api";

// export const useCreateBook = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: createBook,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["books"] });
//     },
//   });
// };