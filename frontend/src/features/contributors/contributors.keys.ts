export const contributorsKeys = {
  all: ['contributors'] as const,
  list: () => [...contributorsKeys.all, 'list'] as const,
} as const;
