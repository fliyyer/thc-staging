import { useQuery } from "@tanstack/react-query";
import { fetchUserOrderHistory } from "@/lib/api/orders-api";

export function useOrderHistory() {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const hasToken = Boolean(token && token !== "undefined" && token !== "null");

  return useQuery({
    queryKey: ["orderHistory"],
    queryFn: fetchUserOrderHistory,
    enabled: hasToken,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
