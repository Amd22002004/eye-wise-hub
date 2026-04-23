import { useQuery } from "@tanstack/react-query";
import { fetchContent } from "@/data/supabaseContent";

export function useContent(includeDrafts = false) {
  return useQuery({
    queryKey: ["content", includeDrafts],
    queryFn: () => fetchContent(includeDrafts),
  });
}