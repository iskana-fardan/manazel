import type { Book } from "../admin/features/books/books.types";
import api from "./apiClient";

export type Level = "beginner" | "intermediate" | "advanced";


// public

// ambil semua buku
export const getBooks = async () => {
    const { data } = await api.get("/books");
    return data;
}


// Helper functions
// ambil buku berdasarkan level
export function getBooksByLevel(books: Book[], level: Level){
    return books.filter(book => book.level === level)
}

// ambil buku berdasarkan field
export function getBooksByField(books: Book[], field: string){
    if (!field) return [];
    return books.filter(book => book.field === field)
}

// merge example
// const nahwuBooks = getBooksByField(books, "nahwu");
// const beginnerNahwu = getBooksByLevel(nahwuBooks, "beginner");











// ambil semua buku beginner berdasarkan field yg diinput
// export const getBeginnerBookByField = async (field: Field,level: Level) => {

// }



// ambil semua buku intermediate berdasarkan field yg diinput


// ambil semua buku advanced berdasarkan field yg diinput


// ambil semua buku muthalaah berdasarkan field yg diinput





// export const getBooks = async () => {
//     const { data } = await api.get("/books");
//     return data;
// }

// export const createBook = (payload) => api.post("/books", payload);
// export const updateBook = (id, payload) => api.put(`/books/${id}`, payload);
// export const deleteBook = (id) => api.delete(`/books/${id}`);
