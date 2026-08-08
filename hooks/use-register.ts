import { useMutation } from "@tanstack/react-query";
import { registerUser, type RegisterPayload, type RegisterResponse } from "@/lib/api/auth-api";

export function useRegister() {
  return useMutation<RegisterResponse, Error, RegisterPayload>({
    mutationFn: registerUser,
  });
}
