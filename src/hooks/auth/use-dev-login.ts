import { useMutation } from '@tanstack/react-query';
import { devLogin } from "../../api/dev-user.ts";

export function useDevLogin() {
  return useMutation({
    mutationFn: devLogin,
  });
}