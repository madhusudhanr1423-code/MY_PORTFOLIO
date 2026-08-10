import { queryOptions } from "@tanstack/react-query";
import { getPublicProjects, publicProjectsQueryKey } from "./projects.functions";

export const publicProjectsQueryOptions = () =>
  queryOptions({
    queryKey: publicProjectsQueryKey,
    queryFn: () => getPublicProjects(),
    staleTime: 60_000,
  });
