import { useQuery } from '@tanstack/react-query';
import { getAllRoadmaps } from './roadmaps.api';
import { roadmapsKeys } from './roadmaps.keys';

export const useAllRoadmaps = () =>
  useQuery({
    queryKey: roadmapsKeys.list(),
    queryFn: getAllRoadmaps,
  });
