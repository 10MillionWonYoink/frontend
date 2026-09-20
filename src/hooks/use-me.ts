import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/auth";

export const authQueryKeys = {
  all: ["auth"] as const,
  me: ["auth", "me"] as const,
};

export function useMe() {
  return useQuery({
    queryKey: authQueryKeys.me,
    queryFn: getMe,
    retry: false,
  });
}
