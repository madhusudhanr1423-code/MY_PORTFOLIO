import { queryOptions } from "@tanstack/react-query";
import { getPublicSettings, publicSettingsQueryKey } from "./settings.functions";

export const publicSettingsQueryOptions = () =>
  queryOptions({
    queryKey: publicSettingsQueryKey,
    queryFn: () => getPublicSettings(),
    staleTime: 60_000,
  });

/** Human-readable label for an availability status value. */
export function availabilityLabel(status: string | null | undefined, fallback: string) {
  if (!status) return fallback;
  const map: Record<string, string> = {
    available: "Available for freelance projects",
    open: "Open for new projects",
    busy: "Currently booked — limited availability",
    unavailable: "Not taking new projects right now",
  };
  return map[status.toLowerCase()] ?? status;
}
