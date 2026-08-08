import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserProfile,
  updateUserProfile,
  type UpdateProfilePayload,
  type UserProfile,
} from "@/lib/api/auth-api";

export function useProfile() {
  return useQuery<UserProfile, Error>({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, Error, UpdateProfilePayload>({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["userProfile"], data);
    },
  });
}
