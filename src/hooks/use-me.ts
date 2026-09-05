import { useQuery } from "@tanstack/react-query";
import { getMe } from "../features/auth/get-me.api.ts";

export function useMe() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getMe,
    retry: false,
  });
}