"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, type ReactNode } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const originalFetch = window.fetch;
      window.fetch = async function (...args) {
        const response = await originalFetch(...args);
        
        if (response.status === 401) {
          // Do not redirect on login or register endpoints
          const url = typeof args[0] === "string" 
            ? args[0] 
            : (args[0] instanceof URL ? args[0].toString() : "");
            
          if (url && (url.includes("/auth/login") || url.includes("/auth/register"))) {
            return response;
          }

          const accessToken = localStorage.getItem("accessToken");
          const refreshToken = localStorage.getItem("refreshToken");
          
          if (accessToken || refreshToken) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            // Clear cart or other local storage sessions if necessary
            // Force redirect to login page
            window.location.href = "/auth/login";
          }
        }
        return response;
      };
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
