import { useQuery } from "@tanstack/react-query";
import { getBooks } from "../services/books.api";
import type { Book } from "../admin/features/books/books.types";



export const useBooks = () => {
    return useQuery<Book[]>({
        queryKey: ["books"],
        queryFn: getBooks,
    })
}

