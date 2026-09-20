import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../api/auth";
import { authQueryKeys } from "./use-me";

export function useSignup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signup,

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authQueryKeys.me });
    },
  });
}
