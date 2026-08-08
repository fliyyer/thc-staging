import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWishlist, toggleWishlist, clearWishlist } from "@/lib/api/wishlist-api";
import { useCart } from "@/context/cart-context";

export function useWishlist() {
  const { showToast } = useCart();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      if (!token || token === "undefined" || token === "null") {
        return Promise.resolve([]);
      }
      return fetchWishlist();
    },
    retry: false,
  });

  const toggleMutation = useMutation({
    mutationFn: toggleWishlist,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      showToast(data.message);
    },
  });

  const clearMutation = useMutation({
    mutationFn: clearWishlist,
    onSuccess: (data) => {
      queryClient.setQueryData(["wishlist"], []);
      showToast(data.message);
    },
  });

  return {
    wishlist: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    toggleWishlist: (productId: string) => toggleMutation.mutate(productId),
    clearWishlist: () => clearMutation.mutate(),
    isToggling: toggleMutation.isPending,
    isClearing: clearMutation.isPending,
  };
}
