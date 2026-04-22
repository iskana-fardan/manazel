import { useQuery } from "@tanstack/react-query";
import { getAllRoadmaps } from "../services/roadmaps.api";
import type { Roadmap } from "../admin/features/roadmaps/roadmap.types";

export const useAllRoadmaps = () => {
  return useQuery<Roadmap[]>({
    queryKey: ["roadmaps"],
    queryFn: getAllRoadmaps,
  });
};
