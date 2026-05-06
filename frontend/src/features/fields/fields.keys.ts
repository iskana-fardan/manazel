export const fieldsKeys = {
  all: ['fields'] as const,
  list: () => [...fieldsKeys.all, 'list'] as const,
} as const;
