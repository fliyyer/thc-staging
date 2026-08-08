import { useMutation } from "@tanstack/react-query";
import { placeOrder } from "@/lib/api/orders-api";

export function usePlaceOrder() {
  return useMutation({
    mutationFn: placeOrder,
  });
}
