export const roadmapsKeys = {
  all: ['roadmaps'] as const,
  list: () => [...roadmapsKeys.all, 'list'] as const,
  // singular 'roadmap' key intentional — matches existing cache consumers
  detail: (fieldSlug: string) => ['roadmap', fieldSlug] as const,
} as const;
