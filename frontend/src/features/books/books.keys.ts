export const booksKeys = {
  all: ['books'] as const,
  list: () => [...booksKeys.all, 'list'] as const,
} as const;
