import { useQuery } from "@tanstack/react-query";
import { getContributors } from "../services/contributors.api";
import type { Contributor } from "../admin/features/contributors/contributors.types";

export const useContributors = () => {
  return useQuery<Contributor[]>({
    queryKey: ["contributors"],
    queryFn: getContributors,
  });
};
