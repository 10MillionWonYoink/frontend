import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { signup } from "../features/auth/signup.api.ts";

export function useSignup() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: signup,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["auth", "me"],
      });
    },
  });
}