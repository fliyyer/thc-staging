import { useMutation } from "@tanstack/react-query";
import {
  loginUser,
  type LoginPayload,
  type LoginResponse,
} from "@/lib/api/auth-api";

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: loginUser,
  });
}
